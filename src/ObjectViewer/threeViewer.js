import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { mediaUrl } from '../utils/data';

export const loadModel = (url, fileType, onProgress) => new Promise((resolve, reject) => {
  const modelUrl = mediaUrl(url);
  let aviso = -1;
  const progress = event => {
    if (!onProgress || !event || !event.lengthComputable || !event.total) return;
    const percent = Math.round(event.loaded / event.total * 100);
    if (percent === aviso) return;
    aviso = percent;
    onProgress(percent);
  };
  if (fileType === 'glb' || fileType === 'gltf') {
    new GLTFLoader().load(modelUrl, gltf => resolve(gltf.scene), progress, reject);
  } else if (fileType === 'obj') {
    new OBJLoader().load(modelUrl, resolve, progress, reject);
  } else {
    reject(new Error(`Formato não suportado: ${fileType}`));
  }
});

export const loadingLabel = progresso => {
  if (progresso >= 100) return 'Preparando modelo 3D...';
  if (progresso > 0) return `Baixando modelo 3D... ${progresso}%`;
  return 'Carregando modelo 3D...';
};

export const disposeObject = object => {
  object.traverse(child => {
    // O destaque troca o material por um clone. Restaura o original antes de
    // descartar as texturas, que continuam compartilhadas com esse original.
    if (child.userData && child.userData.materialOriginal) {
      const clone = child.material;
      child.material = child.userData.materialOriginal;
      delete child.userData.materialOriginal;
      const clones = Array.isArray(clone) ? clone : [clone];
      clones.forEach(material => {
        if (material && material.dispose) {
          material.dispose();
        }
      });
    }
    if (child.geometry) {
      child.geometry.dispose();
    }
    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach(material => {
        Object.keys(material).forEach(key => {
          const value = material[key];
          if (value && value.isTexture) {
            value.dispose();
          }
        });
        material.dispose();
      });
    }
  });
};

const isVisibleInScene = object => {
  for (let current = object; current; current = current.parent) {
    if (!current.visible) {
      return false;
    }
  }
  return true;
};

const normalMatrix = new THREE.Matrix3();

// Primeira interseção do raio com uma superfície de malha visível do modelo.
// A normal retornada está em coordenadas de mundo e voltada para a câmera.
export const pickSurface = (raycaster, model) => {
  const hits = raycaster.intersectObject(model, true);
  for (let i = 0; i < hits.length; i++) {
    const hit = hits[i];
    if (hit.object.isMesh && hit.face && isVisibleInScene(hit.object) && !hit.object.userData.destaqueParte) {
      normalMatrix.getNormalMatrix(hit.object.matrixWorld);
      const normal = hit.face.normal.clone().applyMatrix3(normalMatrix).normalize();
      if (normal.dot(raycaster.ray.direction) > 0) {
        normal.negate();
      }
      return {
        point: hit.point,
        normal,
        distance: hit.distance,
        mesh: hit.object,
        faceIndex: hit.faceIndex,
      };
    }
  }
  return null;
};

const getContainerSize = container => {
  const width = container.clientWidth || 300;
  const height = container.clientHeight || width;
  return { width, height };
};

// Acima disto o modelo (o crânio explodido passa de um milhão de triângulos)
// não aguenta pixel cheio, antialias e um raio por pino a cada quadro.
const LIMITE_MODELO_PESADO = 80000;

const contarTriangulos = model => {
  let total = 0;
  model.traverse(child => {
    if (!child.isMesh || !child.geometry || (child.userData && child.userData.destaqueParte)) {
      return;
    }
    const geometry = child.geometry;
    if (geometry.index) {
      total += geometry.index.count / 3;
    } else if (geometry.attributes && geometry.attributes.position) {
      total += geometry.attributes.position.count / 3;
    }
  });
  return total;
};

// Luz presa à câmera, com o alvo também na câmera, para o sombreado
// acompanhar o ponto de vista e não o mundo.
const acrescentarLuz = (camera, luz, posicao) => {
  const alvo = new THREE.Object3D();
  alvo.position.set(0, 0, -1);
  luz.position.copy(posicao);
  luz.target = alvo;
  camera.add(luz);
  camera.add(alvo);
};

// O modelo nunca é transformado: as coordenadas de mundo dos pontos marcados
// coincidem com as coordenadas do próprio arquivo 3D.
export const createViewer = (container, model) => {
  const { width, height } = getContainerSize(container);
  const pesado = contarTriangulos(model) > LIMITE_MODELO_PESADO;

  const renderer = new THREE.WebGLRenderer({
    antialias: !pesado,
    alpha: true,
    powerPreference: 'high-performance',
  });
  // r156 liga a luz física por padrão. Junto com o mapa de ambiente isso
  // estourava o bege do osso e apagava o relevo, sobretudo visto de cima.
  renderer._useLegacyLights = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.setPixelRatio(pesado ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  Object.assign(renderer.domElement.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: '0',
    display: 'block',
  });
  container.appendChild(renderer.domElement);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(width, height);
  Object.assign(labelRenderer.domElement.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: '1',
    pointerEvents: 'none',
  });
  container.appendChild(labelRenderer.domElement);

  const scene = new THREE.Scene();

  // Sem mapa de ambiente: ele somava uma luz de teto e deixava a calota branca.
  // A principal vem de cima e de lado, para a vista superior ainda mostrar o osso.
  scene.add(new THREE.HemisphereLight(0xfff4ea, 0x5a5856, 0.72));

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  acrescentarLuz(camera, new THREE.DirectionalLight(0xfff7f0, 1.05), new THREE.Vector3(0.42, 1.15, 0.72));
  acrescentarLuz(camera, new THREE.DirectionalLight(0xd5dde6, 0.34), new THREE.Vector3(-0.95, 0.05, 0.55));
  scene.add(camera);

  scene.add(model);

  const sphere = new THREE.Box3().setFromObject(model).getBoundingSphere(new THREE.Sphere());
  const radius = sphere.radius > 0 ? sphere.radius : 1;
  const center = sphere.center;

  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
  const distance = (radius / Math.sin(Math.min(verticalFov, horizontalFov) / 2)) * 1.1;

  camera.near = radius / 100;
  camera.far = distance + radius * 100;
  camera.position.copy(center).add(new THREE.Vector3(0, 0, distance));
  camera.updateProjectionMatrix();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(center);
  controls.enableDamping = !pesado;
  controls.zoomToCursor = true;
  controls.minDistance = radius * 0.2;
  controls.maxDistance = distance * 5;
  controls.update();

  let quadro = 0;

  const desenhar = () => {
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  };

  const pedirQuadro = () => {
    if (quadro) {
      return;
    }
    quadro = requestAnimationFrame(() => {
      quadro = 0;
      desenhar();
    });
  };

  const aoMudarCamera = () => pedirQuadro();
  controls.addEventListener('change', aoMudarCamera);
  pedirQuadro();

  const resize = () => {
    const size = getContainerSize(container);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
    labelRenderer.setSize(size.width, size.height);
    pedirQuadro();
  };

  let resizeObserver = null;
  if (window.ResizeObserver) {
    resizeObserver = new window.ResizeObserver(resize);
    resizeObserver.observe(container);
  } else {
    window.addEventListener('resize', resize);
  }

  const dispose = () => {
    if (quadro) {
      cancelAnimationFrame(quadro);
      quadro = 0;
    }
    controls.removeEventListener('change', aoMudarCamera);
    if (resizeObserver) {
      resizeObserver.disconnect();
    } else {
      window.removeEventListener('resize', resize);
    }
    controls.dispose();
    scene.remove(model);
    disposeObject(model);
    renderer.dispose();
    renderer.forceContextLoss();
    [renderer.domElement, labelRenderer.domElement].forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
  };

  return {
    scene,
    camera,
    renderer,
    controls,
    model,
    radius,
    pesado,
    requestRender: pedirQuadro,
    dispose,
  };
};

export const statusMessageStyle = {
  position: 'absolute',
  top: '50%',
  left: 0,
  right: 0,
  textAlign: 'center',
  transform: 'translateY(-50%)',
  color: 'rgba(0, 0, 0, 0.45)',
};
