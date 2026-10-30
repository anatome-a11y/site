import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { createViewer, disposeObject, loadModel, loadingLabel, pickSurface, statusMessageStyle } from '../ObjectViewer/threeViewer';
import { useViewerBackground, ViewerBackgroundControl, viewerStatusColor } from '../ObjectViewer/viewerBackground';
import {
  aplicarDestaques,
  chaveMalha,
  contornoFechado,
  malhasDaMesmaParte,
  corDaParte,
  limparDestaques,
  listaFaces,
  recortarContorno,
} from '../ObjectViewer/destaqueMalha';

// Deslocamento máximo (px) entre pointerdown e pointerup para o gesto contar
// como clique de marcação e não como rotação da câmera.
const CLICK_TOLERANCE_PX = 5;
// Raio, em pixels de tela, do cursor de pré-visualização sobre a superfície.
const CURSOR_RADIUS_PX = 11;
// Distância, em pixels, para o fim do traço encontrar o início e fechar a área.
const FECHAMENTO_PX = 28;
// O traço só começa depois que o ponteiro anda, para um toque continuar sendo ponto.
const MIN_TRACO_PX = 8;
// Espaço mínimo entre amostras do contorno.
const AMOSTRAGEM_PX = 6;
// Intervalo mínimo (ms) entre atualizações do teste de oclusão dos pinos.
const OCCLUSION_INTERVAL_MS = 100;

const MARKER_COLOR = '#f5222d';

// Esferas em mundo para um modelo grande. O raio contra cada triângulo,
// repetido para cada pino, travava o giro do crânio com todas as partes marcadas.
const esferasDoModelo = modelo => {
  if (modelo.userData.esferasOclusao) {
    return modelo.userData.esferasOclusao;
  }
  const lista = [];
  modelo.updateMatrixWorld(true);
  modelo.traverse(child => {
    if (!child.isMesh || !child.geometry || (child.userData && child.userData.destaqueParte)) {
      return;
    }
    if (!child.geometry.boundingSphere) {
      child.geometry.computeBoundingSphere();
    }
    const origem = child.geometry.boundingSphere;
    if (!origem) {
      return;
    }
    lista.push(origem.clone().applyMatrix4(child.matrixWorld));
  });
  modelo.userData.esferasOclusao = lista;
  return lista;
};

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
  const cor = corDaParte(ponto.label);

  const pin = document.createElement('div');
  pin.title = nomeParte;
  Object.assign(pin.style, {
    width: '10px',
    height: '10px',
    boxSizing: 'border-box',
    borderRadius: '50%',
    background: cor,
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
    background: cor,
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
  zIndex: 2,
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
  const [progresso, setProgresso] = useState(0);
  const [modoMarcacao, setModoMarcacao] = useState(null);
  const modoRef = useRef(null);
  const [background, setBackground] = useViewerBackground();

  const latestProps = useRef({});
  latestProps.current = { onObject3DClick, onPointClick, idx, enableOnClick };
  modoRef.current = modoMarcacao;
  const desenhando = modoMarcacao === 'regiao';
  const escolhendoParte = modoMarcacao === 'parte';

  useEffect(() => {
    if (!url) {
      return undefined;
    }

    let cancelled = false;
    let created = null;
    setStatus('loading');
    setProgresso(0);
    setModoMarcacao(null);

    let ultimo = -1;
    loadModel(url, fileType, percent => {
      if (cancelled || percent === ultimo) return;
      ultimo = percent;
      setProgresso(percent);
    })
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
      setModoMarcacao(null);
      modoRef.current = null;
      if (created) {
        created.dispose();
        created = null;
      }
    };
  }, [url, fileType]);

  // Clique marca o ponto. Ctrl+clique, ou Escolher parte, colore a malha.
  // Shift+arrastar, ou Desenhar região, traça o contorno.
  useEffect(() => {
    if (!viewer) {
      return undefined;
    }

    const { scene, renderer, camera, controls, model, radius } = viewer;
    model.userData.raioDestaque = radius;
    const canvas = renderer.domElement;
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const cursor = createSurfaceCursor();
    scene.add(cursor.object);

    const botoesOriginais = {
      LEFT: controls.mouseButtons.LEFT,
      RIGHT: controls.mouseButtons.RIGHT,
    };
    const toqueOriginal = controls.touches.ONE;
    const toqueDoisOriginal = controls.touches.TWO;

    const activePointers = new Set();
    let gestureStart = null;
    let gestureCancelled = false;
    let gestoDesenha = false;
    let modoDoGesto = 'ponto';
    let travarOrbita = false;
    let hoverPosition = null;
    let frame = null;
    let amostras = [];
    let linha = null;
    // Comprimento do traço na tela. A distância entre o início e o fim não serve:
    // ao fechar a forma o ponteiro volta para perto do ponto de partida.
    let percursoPx = 0;
    let ultimoPonteiro = null;

    const pickAt = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      ndc.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(ndc, camera);
      raycaster.far = Infinity;
      return pickSurface(raycaster, model);
    };

    const sincronizarBotoes = () => {
      const travado = modoRef.current === 'regiao' || modoRef.current === 'parte' || travarOrbita;
      if (travado) {
        controls.mouseButtons.LEFT = -1;
        controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
        controls.touches.ONE = -1;
        controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
      } else {
        controls.mouseButtons.LEFT = botoesOriginais.LEFT;
        controls.mouseButtons.RIGHT = botoesOriginais.RIGHT;
        controls.touches.ONE = toqueOriginal;
        controls.touches.TWO = toqueDoisOriginal;
      }
    };

    const modoNoEvento = event => {
      const comCtrl = event.ctrlKey || event.metaKey;
      const comShift = event.shiftKey;
      if (comShift || (modoRef.current === 'regiao' && !comCtrl)) {
        return 'regiao';
      }
      if (comCtrl || modoRef.current === 'parte') {
        return 'parte';
      }
      return 'ponto';
    };

    const isDragging = () => activePointers.size > 0 && (gestureCancelled || !gestureStart);

    const worldPerPixelAt = point => {
      const viewHeight = 2 * camera.position.distanceTo(point) * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      return viewHeight / (canvas.clientHeight || 1);
    };

    const descartarLinha = () => {
      if (!linha) {
        return;
      }
      scene.remove(linha);
      if (linha.geometry) {
        linha.geometry.dispose();
      }
      if (linha.material) {
        linha.material.dispose();
      }
      linha = null;
    };

    const atualizarLinha = () => {
      descartarLinha();
      if (amostras.length < 2) {
        return;
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(amostras.map(item => item.point));
      const material = new THREE.LineBasicMaterial({
        color: MARKER_COLOR,
        depthTest: false,
        transparent: true,
        opacity: 0.95,
        toneMapped: false,
      });
      linha = new THREE.Line(geometry, material);
      linha.userData.destaqueParte = true;
      linha.renderOrder = 4;
      scene.add(linha);
    };

    const limparTraco = () => {
      descartarLinha();
      amostras = [];
      gestoDesenha = false;
      percursoPx = 0;
      ultimoPonteiro = null;
    };

    const somarPercurso = (x, y) => {
      if (!ultimoPonteiro) {
        ultimoPonteiro = { x, y };
        return;
      }
      percursoPx += Math.hypot(x - ultimoPonteiro.x, y - ultimoPonteiro.y);
      ultimoPonteiro = { x, y };
    };

    const emitirPonto = (point, extra) => {
      const { enableOnClick, onObject3DClick, idx } = latestProps.current;
      if (!enableOnClick || !onObject3DClick || !point) {
        return;
      }
      onObject3DClick(point.x, point.y, point.z, idx, extra);
    };

    const registrarAmostra = (clientX, clientY, forcar) => {
      const anterior = amostras[amostras.length - 1];
      if (!forcar && anterior && Math.hypot(clientX - anterior.tela.x, clientY - anterior.tela.y) < AMOSTRAGEM_PX) {
        return;
      }
      const hit = pickAt(clientX, clientY);
      if (!hit || !hit.mesh) {
        return;
      }
      const projetado = hit.point.clone().project(camera);
      amostras.push({
        point: hit.point.clone(),
        mesh: hit.mesh,
        tela: { x: clientX, y: clientY, profundidade: projetado.z, distancia: hit.distance },
      });
      atualizarLinha();
    };

    const updateCursor = () => {
      frame = null;
      sincronizarBotoes();
      if (gestoDesenha && gestureCancelled && hoverPosition) {
        registrarAmostra(hoverPosition.x, hoverPosition.y, false);
      }
      const { enableOnClick } = latestProps.current;
      const hit = hoverPosition && enableOnClick && !gestoDesenha && !isDragging()
        && !(viewer.pesado && activePointers.size > 0)
        ? pickAt(hoverPosition.x, hoverPosition.y)
        : null;
      if (!hit) {
        cursor.object.visible = false;
      } else {
        cursor.place(hit.point, hit.normal, worldPerPixelAt(hit.point) * CURSOR_RADIUS_PX);
      }
      if (viewer.requestRender) {
        viewer.requestRender();
      }
    };

    const scheduleCursor = () => {
      if (frame === null) {
        frame = requestAnimationFrame(updateCursor);
      }
    };

    const setHover = event => {
      hoverPosition = event.pointerType === 'touch' ? null : { x: event.clientX, y: event.clientY };
    };

    const prepararBotoes = event => {
      if (event.button !== 0) {
        return;
      }
      modoDoGesto = modoNoEvento(event);
      travarOrbita = modoDoGesto !== 'ponto';
      sincronizarBotoes();
    };

    const onPointerDown = event => {
      activePointers.add(event.pointerId);
      if (activePointers.size === 1 && event.button === 0) {
        gestureStart = { x: event.clientX, y: event.clientY };
        gestureCancelled = false;
        gestoDesenha = modoDoGesto === 'regiao';
        amostras = [];
        percursoPx = 0;
        ultimoPonteiro = { x: event.clientX, y: event.clientY };
        if (gestoDesenha && canvas.setPointerCapture) {
          try {
            canvas.setPointerCapture(event.pointerId);
          } catch (e) {
            // O ponteiro pode já ter sido solto; o traço segue pelos eventos normais.
          }
        }
      } else {
        gestureStart = null;
        gestureCancelled = true;
        gestoDesenha = false;
        percursoPx = 0;
        ultimoPonteiro = null;
      }
      setHover(event);
      scheduleCursor();
    };

    const onPointerMove = event => {
      if (gestoDesenha && activePointers.has(event.pointerId)) {
        somarPercurso(event.clientX, event.clientY);
      }
      if (gestureStart && !gestureCancelled
        && Math.hypot(event.clientX - gestureStart.x, event.clientY - gestureStart.y) > CLICK_TOLERANCE_PX) {
        gestureCancelled = true;
        if (gestoDesenha) {
          registrarAmostra(gestureStart.x, gestureStart.y, true);
        }
      }
      setHover(event);
      scheduleCursor();
    };

    const encerrarTrava = () => {
      if (activePointers.size === 0) {
        travarOrbita = false;
        sincronizarBotoes();
      }
    };

    const finishGesture = event => {
      activePointers.delete(event.pointerId);
      if (activePointers.size === 0) {
        gestureStart = null;
        gestureCancelled = false;
      }
      encerrarTrava();
      setHover(event);
      scheduleCursor();
    };

    const onPointerUp = event => {
      if (gestoDesenha) {
        somarPercurso(event.clientX, event.clientY);
      }
      const start = gestureStart;
      const desenhou = gestoDesenha;
      const isClick = start && !gestureCancelled && activePointers.size === 1 && activePointers.has(event.pointerId);
      const percorreu = percursoPx > MIN_TRACO_PX;
      if (desenhou && percorreu) {
        registrarAmostra(event.clientX, event.clientY, true);
      }
      const tracoAmostras = amostras.slice();
      finishGesture(event);
      limparTraco();

      const { enableOnClick, onObject3DClick } = latestProps.current;
      if (!enableOnClick || !onObject3DClick || !start) {
        return;
      }

      if (!desenhou || !percorreu || tracoAmostras.length < 2) {
        if (!isClick && !(desenhou && !percorreu)) {
          return;
        }
        const hit = pickAt(start.x, start.y);
        if (!hit || !hit.mesh) {
          return;
        }
        if (modoDoGesto === 'parte') {
          const grupo = malhasDaMesmaParte(model, hit.mesh);
          const chaves = grupo.map(item => chaveMalha(item));
          emitirPonto(hit.point, {
            malha: chaveMalha(hit.mesh),
            malhas: chaves,
          });
          return;
        }
        emitirPonto(hit.point);
        return;
      }

      const malhas = new Map();
      tracoAmostras.forEach(item => {
        const chave = chaveMalha(item.mesh);
        malhas.set(chave, (malhas.get(chave) || 0) + 1);
      });
      let malha = null;
      let maior = 0;
      malhas.forEach((contagem, chave) => {
        if (contagem > maior) {
          maior = contagem;
          malha = chave;
        }
      });
      const mesh = tracoAmostras.find(item => chaveMalha(item.mesh) === malha).mesh;
      const tela = tracoAmostras.map(item => item.tela);
      const fechado = contornoFechado(tela, FECHAMENTO_PX);
      const area = fechado
        ? recortarContorno(mesh, camera, canvas.getBoundingClientRect(), tela)
        : null;
      const faces = area ? listaFaces(area.faces) : [];
      const recorte = area && area.recorte.length >= 3 ? area.recorte : undefined;
      const traco = tracoAmostras.map(item => ({
        x: item.point.x,
        y: item.point.y,
        z: item.point.z,
      }));
      emitirPonto(tracoAmostras[0].point, {
        malha,
        faces: faces.length ? faces : undefined,
        recorte,
        traco,
      });
      if (modoRef.current === 'regiao') {
        setModoMarcacao(null);
      }
    };

    const onPointerLeave = () => {
      hoverPosition = null;
      scheduleCursor();
    };

    const onPointerCancel = event => {
      finishGesture(event);
      limparTraco();
    };

    sincronizarBotoes();
    canvas.addEventListener('pointerdown', prepararBotoes, true);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerCancel);
    canvas.addEventListener('pointerleave', onPointerLeave);
    if (!viewer.pesado) {
      controls.addEventListener('change', scheduleCursor);
    }

    return () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
      limparTraco();
      controls.mouseButtons.LEFT = botoesOriginais.LEFT;
      controls.mouseButtons.RIGHT = botoesOriginais.RIGHT;
      controls.touches.ONE = toqueOriginal;
      controls.touches.TWO = toqueDoisOriginal;
      canvas.removeEventListener('pointerdown', prepararBotoes, true);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      if (!viewer.pesado) {
        controls.removeEventListener('change', scheduleCursor);
      }
      scene.remove(cursor.object);
      cursor.dispose();
    };
  }, [viewer, enableOnClick, modoMarcacao]);

  // Sem parte pendente os botões somem. O modo não pode ficar ligado depois disso,
  // senão o arrasto continua traçando e a peça não gira.
  useEffect(() => {
    if (!instrucao && modoMarcacao) {
      setModoMarcacao(null);
    }
  }, [instrucao, modoMarcacao]);


  const resumoFaces = faces => {
    if (!faces || !faces.length) {
      return '';
    }
    let hash = faces.length;
    const passo = Math.max(1, Math.floor(faces.length / 24));
    for (let i = 0; i < faces.length; i += passo) {
      hash = Math.imul(hash, 33) + (faces[i] | 0);
    }
    return String(hash);
  };

  // O pai altera o array de pontos no lugar, então a dependência do efeito
  // precisa ser derivada do conteúdo, não da referência.
  const pontosKey = (pontos || []).map(p => [
    p.label, p.x, p.y, p.z, p.malha || '', (p.malhas || []).join(','), resumoFaces(p.faces),
    p.traco ? p.traco.length : 0, p.recorte ? p.recorte.length : 0,
  ].join(':')).join('|');

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
    const pontoTeste = new THREE.Vector3();
    const tolerance = radius * 0.005;
    let occlusionTimeout = null;
    let interagindo = false;
    const esferas = viewer.pesado ? esferasDoModelo(model) : null;

    // Pinos atrás da superfície ficam translúcidos e sem interação.
    // Durante o giro o teste fica parado: no crânio ele percorria mais de um
    // milhão de triângulos para cada parte marcada.
    const updateOcclusion = () => {
      occlusionTimeout = null;
      pins.forEach(pin => {
        direction.subVectors(pin.position, camera.position);
        const distance = direction.length();
        if (distance < 1e-8) {
          return;
        }
        direction.multiplyScalar(1 / distance);
        let occluded = false;
        if (esferas) {
          raycaster.ray.set(camera.position, direction);
          for (let i = 0; i < esferas.length; i += 1) {
            const esfera = esferas[i];
            if (esfera.containsPoint(pin.position)) {
              continue;
            }
            const hit = raycaster.ray.intersectSphere(esfera, pontoTeste);
            if (hit && hit.distanceTo(camera.position) < distance - tolerance) {
              occluded = true;
              break;
            }
          }
        } else {
          raycaster.set(camera.position, direction);
          raycaster.far = distance;
          const hit = pickSurface(raycaster, model);
          occluded = hit !== null && hit.distance < distance - tolerance;
        }
        pin.element.style.opacity = occluded ? '0.3' : '1';
        pin.element.style.pointerEvents = occluded ? 'none' : 'auto';
      });
    };

    const scheduleOcclusion = () => {
      if (interagindo) {
        return;
      }
      if (occlusionTimeout !== null) {
        clearTimeout(occlusionTimeout);
      }
      occlusionTimeout = setTimeout(updateOcclusion, OCCLUSION_INTERVAL_MS);
    };

    const aoComecarGesto = () => {
      interagindo = true;
      if (occlusionTimeout !== null) {
        clearTimeout(occlusionTimeout);
        occlusionTimeout = null;
      }
    };
    const aoTerminarGesto = () => {
      interagindo = false;
      scheduleOcclusion();
    };

    updateOcclusion();
    controls.addEventListener('start', aoComecarGesto);
    controls.addEventListener('end', aoTerminarGesto);
    if (viewer.requestRender) {
      viewer.requestRender();
    }

    return () => {
      clearTimeout(occlusionTimeout);
      controls.removeEventListener('start', aoComecarGesto);
      controls.removeEventListener('end', aoTerminarGesto);
      pins.forEach(pin => {
        if (pin.element.parentNode) {
          pin.element.parentNode.removeChild(pin.element);
        }
      });
      scene.remove(group);
    };
  }, [viewer, pontosKey, !!onPointClick]);

  // pontosKey resume o conteúdo porque o pai muta o array no lugar.
  useEffect(() => {
    if (!viewer) {
      return undefined;
    }
    viewer.model.userData.raioDestaque = viewer.radius;
    aplicarDestaques(viewer.model, pontos || []);
    if (viewer.requestRender) {
      viewer.requestRender();
    }
    return () => limparDestaques(viewer.model);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewer, pontosKey]);

  const messageStyle = { ...statusMessageStyle, zIndex: 2, color: viewerStatusColor(background) };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: desenhando ? 'crosshair' : (escolhendoParte ? 'pointer' : 'grab'),
        backgroundColor: background.color,
      }}
    >
      <ViewerBackgroundControl value={background.id} onChange={setBackground} />
      {status === 'ready' && enableOnClick && (instrucao || modoMarcacao) && (
        <div
          onPointerDown={event => event.stopPropagation()}
          onClick={event => event.stopPropagation()}
          style={{
            position: 'absolute',
            top: 6,
            left: 6,
            zIndex: 2,
            display: 'flex',
            gap: 6,
          }}
        >
          <button
            type="button"
            onClick={() => setModoMarcacao(atual => (atual === 'parte' ? null : 'parte'))}
            style={{
              minHeight: 32,
              padding: '4px 10px',
              border: '1px solid rgba(0, 0, 0, 0.25)',
              borderRadius: 4,
              background: escolhendoParte ? '#1890ff' : '#fff',
              color: escolhendoParte ? '#fff' : 'rgba(0, 0, 0, 0.75)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Escolher parte
          </button>
          <button
            type="button"
            onClick={() => setModoMarcacao(atual => (atual === 'regiao' ? null : 'regiao'))}
            style={{
              minHeight: 32,
              padding: '4px 10px',
              border: '1px solid rgba(0, 0, 0, 0.25)',
              borderRadius: 4,
              background: desenhando ? '#f5222d' : '#fff',
              color: desenhando ? '#fff' : 'rgba(0, 0, 0, 0.75)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Desenhar região
          </button>
        </div>
      )}
      {status === 'loading' && <div style={messageStyle}>{loadingLabel(progresso)}</div>}
      {status === 'error' && <div style={messageStyle}>Não foi possível carregar o modelo 3D.</div>}
      {status === 'ready' && enableOnClick && (
        <div style={hintStyle}>
          <div>
            {!instrucao && 'Todas as partes foram marcadas'}
            {instrucao && !modoMarcacao && (
              <React.Fragment>
                Clique marca o ponto de <b>{instrucao}</b>. Ctrl+clique, ou <b>Escolher parte</b>, colore a parte inteira. Shift+arrastar, ou <b>Desenhar região</b>, contorna a área.
              </React.Fragment>
            )}
            {instrucao && escolhendoParte && (
              <React.Fragment>Clique colore a parte inteira de <b>{instrucao}</b>.</React.Fragment>
            )}
            {instrucao && desenhando && (
              <React.Fragment>Arraste o contorno de <b>{instrucao}</b>. Feche a forma para colorir a área; se ficar aberta, só a linha é marcada.</React.Fragment>
            )}
          </div>
          <div style={{ opacity: 0.75 }}>
            {modoMarcacao
              ? 'Botão direito ou dois dedos: girar · Roda: aproximar · Clique de novo no botão: voltar a arrastar'
              : 'Arrastar: girar · Botão direito: mover · Roda: aproximar'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectPointMapper;
