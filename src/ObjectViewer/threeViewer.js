import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';

export const loadModel = (url, fileType) => new Promise((resolve, reject) => {
  if (fileType === 'glb' || fileType === 'gltf') {
    new GLTFLoader().load(url, gltf => resolve(gltf.scene), undefined, reject);
  } else if (fileType === 'obj') {
    new OBJLoader().load(url, resolve, undefined, reject);
  } else {
    reject(new Error(`Formato não suportado: ${fileType}`));
  }
});

export const disposeObject = object => {
  object.traverse(child => {
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
    if (hit.object.isMesh && hit.face && isVisibleInScene(hit.object)) {
      normalMatrix.getNormalMatrix(hit.object.matrixWorld);
      const normal = hit.face.normal.clone().applyMatrix3(normalMatrix).normalize();
      if (normal.dot(raycaster.ray.direction) > 0) {
        normal.negate();
      }
      return { point: hit.point, normal, distance: hit.distance };
    }
  }
  return null;
};

const getContainerSize = container => {
  const width = container.clientWidth || 300;
  const height = container.clientHeight || width;
  return { width, height };
};

// O modelo nunca é transformado: as coordenadas de mundo dos pontos marcados
// coincidem com as coordenadas do próprio arquivo 3D.
export const createViewer = (container, model) => {
  const { width, height } = getContainerSize(container);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(width, height);
  Object.assign(labelRenderer.domElement.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    pointerEvents: 'none',
  });
  container.appendChild(labelRenderer.domElement);

  const scene = new THREE.Scene();

  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment(renderer);
  const environment = pmrem.fromScene(room, 0.04).texture;
  scene.environment = environment;
  room.dispose();
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.5));

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  const headLight = new THREE.DirectionalLight(0xffffff, 1.5);
  const headLightTarget = new THREE.Object3D();
  headLightTarget.position.set(0, 0, -1);
  headLight.target = headLightTarget;
  camera.add(headLight);
  camera.add(headLightTarget);
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
  controls.enableDamping = true;
  controls.zoomToCursor = true;
  controls.minDistance = radius * 0.2;
  controls.maxDistance = distance * 5;
  controls.update();

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  });

  const resize = () => {
    const size = getContainerSize(container);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
    labelRenderer.setSize(size.width, size.height);
  };

  let resizeObserver = null;
  if (window.ResizeObserver) {
    resizeObserver = new window.ResizeObserver(resize);
    resizeObserver.observe(container);
  } else {
    window.addEventListener('resize', resize);
  }

  const dispose = () => {
    renderer.setAnimationLoop(null);
    if (resizeObserver) {
      resizeObserver.disconnect();
    } else {
      window.removeEventListener('resize', resize);
    }
    controls.dispose();
    scene.remove(model);
    disposeObject(model);
    environment.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    [renderer.domElement, labelRenderer.domElement].forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
  };

  return { scene, camera, renderer, controls, model, radius, dispose };
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
