import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { createViewer, disposeObject, loadModel, pickSurface, statusMessageStyle } from '../ObjectViewer/threeViewer';

// Deslocamento máximo (px) entre pointerdown e pointerup para o gesto contar
// como clique de marcação e não como rotação da câmera.
const CLICK_TOLERANCE_PX = 5;
// Raio, em pixels de tela, do cursor de pré-visualização sobre a superfície.
const CURSOR_RADIUS_PX = 11;
// Intervalo mínimo (ms) entre atualizações do teste de oclusão dos pinos.
const OCCLUSION_INTERVAL_MS = 100;

const MARKER_COLOR = '#f5222d';

const Z_AXIS = new THREE.Vector3(0, 0, 1);

// Cursor desenhado sobre a superfície do modelo, alinhado à normal do ponto
// sob o mouse. Mostra ao usuário exatamente onde o ponto será criado.
const createSurfaceCursor = () => {
  const object = new THREE.Group();
  object.visible = false;

  const parts = [
    { geometry: new THREE.RingGeometry(0.82, 1, 48), color: 0x000000, opacity: 0.45 },
    { geometry: new THREE.RingGeometry(0.58, 0.82, 48), color: 0xffffff, opacity: 0.95 },
    { geometry: new THREE.CircleGeometry(0.16, 24), color: MARKER_COLOR, opacity: 1 },
  ];
  const materials = parts.map(({ geometry, color, opacity }) => {
    const material = new THREE.MeshBasicMaterial({
      color,
      opacity,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = 999;
    object.add(mesh);
    return material;
  });

  const place = (point, normal, worldRadius) => {
    object.position.copy(point);
    object.quaternion.setFromUnitVectors(Z_AXIS, normal);
    object.scale.setScalar(worldRadius);
    object.visible = true;
  };

  const dispose = () => {
    parts.forEach(({ geometry }) => geometry.dispose());
    materials.forEach(material => material.dispose());
  };

  return { object, place, dispose };
};

// Pino em HTML (tamanho constante na tela): um ponto exatamente sobre a
// coordenada marcada, uma haste e o número da parte acima.
const createPinElement = (ponto, onSelect) => {
  const nomeParte = ponto.parte && ponto.parte.nome ? ponto.parte.nome : '';
  const label = String(ponto.label);

  const pin = document.createElement('div');
  pin.title = nomeParte;
  Object.assign(pin.style, {
    width: '10px',
    height: '10px',
    boxSizing: 'border-box',
    borderRadius: '50%',
    background: MARKER_COLOR,
    border: '2px solid #fff',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.35), 0 1px 3px rgba(0, 0, 0, 0.4)',
    cursor: onSelect ? 'pointer' : 'default',
    pointerEvents: 'auto',
    transition: 'opacity 0.2s',
  });

  const stem = document.createElement('div');
  Object.assign(stem.style, {
    position: 'absolute',
    left: '50%',
    bottom: '100%',
    width: '2px',
    height: '12px',
    marginLeft: '-1px',
    background: '#fff',
    boxShadow: '0 0 0 0.5px rgba(0, 0, 0, 0.35)',
    pointerEvents: 'none',
  });

  const badge = document.createElement('div');
  badge.textContent = label;
  Object.assign(badge.style, {
    position: 'absolute',
    left: '50%',
    bottom: 'calc(100% + 12px)',
    transform: 'translateX(-50%)',
    minWidth: '20px',
    height: '20px',
    padding: '0 6px',
    boxSizing: 'border-box',
    borderRadius: '10px',
    background: MARKER_COLOR,
    border: '1px solid #fff',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.4)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600',
    lineHeight: '18px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    transition: 'transform 0.15s',
  });

  pin.appendChild(stem);
  pin.appendChild(badge);

  pin.addEventListener('mouseenter', () => {
    badge.textContent = nomeParte ? `${label} · ${nomeParte}` : label;
    badge.style.transform = 'translateX(-50%) scale(1.1)';
  });
  pin.addEventListener('mouseleave', () => {
    badge.textContent = label;
    badge.style.transform = 'translateX(-50%)';
  });
  if (onSelect) {
    pin.addEventListener('click', event => {
      event.stopPropagation();
      onSelect(ponto);
    });
  }

  return pin;
};

const hintStyle = {
  position: 'absolute',
  left: 8,
  right: 8,
  bottom: 8,
  zIndex: 1,
  padding: '4px 8px',
  borderRadius: 4,
  background: 'rgba(0, 0, 0, 0.6)',
  color: '#fff',
  fontSize: 12,
  lineHeight: 1.4,
  textAlign: 'center',
  pointerEvents: 'none',
};

const ObjectPointMapper = ({ url, fileType, onObject3DClick, onPointClick, idx, pontos, enableOnClick, instrucao }) => {
  const containerRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [status, setStatus] = useState('loading');

  const latestProps = useRef({});
  latestProps.current = { onObject3DClick, onPointClick, idx, enableOnClick };

  useEffect(() => {
    if (!url) {
      return undefined;
    }

    let cancelled = false;
    let created = null;
    setStatus('loading');

    loadModel(url, fileType)
      .then(model => {
        if (cancelled || !containerRef.current) {
          disposeObject(model);
          return;
        }
        created = createViewer(containerRef.current, model);
        if (cancelled) {
          created.dispose();
          created = null;
          return;
        }
        setViewer(created);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
      setViewer(null);
      if (created) {
        created.dispose();
        created = null;
      }
    };
  }, [url, fileType]);

  // Interação: cursor de pré-visualização e clique de marcação.
  useEffect(() => {
    if (!viewer) {
      return undefined;
    }

    const { scene, renderer, camera, controls, model } = viewer;
    const canvas = renderer.domElement;
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const cursor = createSurfaceCursor();
    scene.add(cursor.object);

    const activePointers = new Set();
    let gestureStart = null;
    let gestureCancelled = false;
    let hoverPosition = null;
    let frame = null;

    const pickAt = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      ndc.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(ndc, camera);
      return pickSurface(raycaster, model);
    };

    const isDragging = () => activePointers.size > 0 && (gestureCancelled || !gestureStart);

    const updateCursor = () => {
      frame = null;
      const { enableOnClick } = latestProps.current;
      const hit = hoverPosition && enableOnClick && !isDragging()
        ? pickAt(hoverPosition.x, hoverPosition.y)
        : null;
      if (!hit) {
        cursor.object.visible = false;
        return;
      }
      const viewHeight = 2 * camera.position.distanceTo(hit.point) * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      const worldPerPixel = viewHeight / (canvas.clientHeight || 1);
      cursor.place(hit.point, hit.normal, worldPerPixel * CURSOR_RADIUS_PX);
    };

    const scheduleCursor = () => {
      if (frame === null) {
        frame = requestAnimationFrame(updateCursor);
      }
    };

    const setHover = event => {
      hoverPosition = event.pointerType === 'touch' ? null : { x: event.clientX, y: event.clientY };
    };

    const onPointerDown = event => {
      activePointers.add(event.pointerId);
      if (activePointers.size === 1 && event.button === 0) {
        gestureStart = { x: event.clientX, y: event.clientY };
        gestureCancelled = false;
      } else {
        gestureStart = null;
        gestureCancelled = true;
      }
      setHover(event);
      scheduleCursor();
    };

    const onPointerMove = event => {
      if (gestureStart && !gestureCancelled
        && Math.hypot(event.clientX - gestureStart.x, event.clientY - gestureStart.y) > CLICK_TOLERANCE_PX) {
        gestureCancelled = true;
      }
      setHover(event);
      scheduleCursor();
    };

    const finishGesture = event => {
      activePointers.delete(event.pointerId);
      if (activePointers.size === 0) {
        gestureStart = null;
        gestureCancelled = false;
      }
      setHover(event);
      scheduleCursor();
    };

    const onPointerUp = event => {
      const start = gestureStart;
      const isClick = start && !gestureCancelled && activePointers.size === 1 && activePointers.has(event.pointerId);
      finishGesture(event);

      const { enableOnClick, onObject3DClick, idx } = latestProps.current;
      if (!isClick || !enableOnClick || !onObject3DClick) {
        return;
      }
      // Usa a posição em que o botão foi pressionado: é onde o usuário mirou.
      const hit = pickAt(start.x, start.y);
      if (hit) {
        onObject3DClick(hit.point.x, hit.point.y, hit.point.z, idx);
      }
    };

    const onPointerLeave = () => {
      hoverPosition = null;
      scheduleCursor();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', finishGesture);
    canvas.addEventListener('pointerleave', onPointerLeave);
    // Zoom e inércia movem a câmera sem mover o mouse: reposiciona o cursor.
    controls.addEventListener('change', scheduleCursor);

    return () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', finishGesture);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      controls.removeEventListener('change', scheduleCursor);
      scene.remove(cursor.object);
      cursor.dispose();
    };
  }, [viewer]);

  // O pai altera o array de pontos no lugar, então a dependência do efeito
  // precisa ser derivada do conteúdo, não da referência.
  const pontosKey = (pontos || []).map(p => `${p.label}:${p.x}:${p.y}:${p.z}`).join('|');

  // Pinos dos pontos já marcados.
  useEffect(() => {
    if (!viewer) {
      return undefined;
    }

    const { scene, camera, controls, model, radius } = viewer;
    const group = new THREE.Group();
    const pins = [];

    const onSelect = ponto => {
      const { onPointClick } = latestProps.current;
      if (onPointClick) {
        onPointClick(ponto);
      }
    };

    (pontos || []).forEach(ponto => {
      if (ponto == null || ponto.z == null) {
        return;
      }
      const pin = new CSS2DObject(createPinElement(ponto, onPointClick ? onSelect : null));
      pin.position.set(Number(ponto.x), Number(ponto.y), Number(ponto.z));
      group.add(pin);
      pins.push(pin);
    });
    scene.add(group);

    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3();
    const tolerance = radius * 0.005;
    let occlusionTimeout = null;

    // Pinos atrás da superfície ficam translúcidos e sem interação.
    const updateOcclusion = () => {
      occlusionTimeout = null;
      pins.forEach(pin => {
        direction.subVectors(pin.position, camera.position);
        const distance = direction.length();
        raycaster.set(camera.position, direction.normalize());
        raycaster.far = distance;
        const hit = pickSurface(raycaster, model);
        const occluded = hit !== null && hit.distance < distance - tolerance;
        pin.element.style.opacity = occluded ? '0.3' : '1';
        pin.element.style.pointerEvents = occluded ? 'none' : 'auto';
      });
    };

    const scheduleOcclusion = () => {
      if (occlusionTimeout === null) {
        occlusionTimeout = setTimeout(updateOcclusion, OCCLUSION_INTERVAL_MS);
      }
    };

    updateOcclusion();
    controls.addEventListener('change', scheduleOcclusion);

    return () => {
      clearTimeout(occlusionTimeout);
      controls.removeEventListener('change', scheduleOcclusion);
      pins.forEach(pin => {
        if (pin.element.parentNode) {
          pin.element.parentNode.removeChild(pin.element);
        }
      });
      scene.remove(group);
    };
  }, [viewer, pontosKey, !!onPointClick]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: enableOnClick ? 'crosshair' : 'grab',
      }}
    >
      {status === 'loading' && <div style={statusMessageStyle}>Carregando modelo 3D...</div>}
      {status === 'error' && <div style={statusMessageStyle}>Não foi possível carregar o modelo 3D.</div>}
      {status === 'ready' && enableOnClick && (
        <div style={hintStyle}>
          <div>
            {instrucao
              ? <React.Fragment>Clique na peça para marcar <b>{instrucao}</b></React.Fragment>
              : 'Todas as partes foram marcadas'}
          </div>
          <div style={{ opacity: 0.75 }}>Arrastar: girar · Botão direito: mover · Roda: aproximar</div>
        </div>
      )}
    </div>
  );
};

export default ObjectPointMapper;
