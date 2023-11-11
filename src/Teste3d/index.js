import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DirectionalLight } from 'three'; // Importe a luz direcional
import { withAppContext } from '../context';

// const ThreeDViewer = ({ /* props adicionais do contexto */ }) => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const container = containerRef.current;

//     // Crie uma cena, uma câmera e um renderizador
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     container.appendChild(renderer.domElement);

//     // Carregue o arquivo 3D usando um loader (por exemplo, GLTFLoader)
//     // const loader = new GLTFLoader();
//     // loader.load('./shoe.gltf', (gltf) => {
//     //   const model = gltf.scene;
//     //   scene.add(model);
//     // });

//     // Adicione luzes, controles de câmera ou outras configurações da cena aqui
//     // Adicione uma luz direcional
//     const ambientLight = new THREE.AmbientLight(0x333333);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     scene.add(directionalLight);
//     directionalLight.position.set(0, 50, 0);

//     // Inicialize os controles de câmera (opcional)
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.update();

//     const helper = new THREE.AxesHelper(20);
//     scene.add(helper);

//     // Configure a posição inicial da câmera
//     camera.position.set(0, 6, 6);

//     const mouse = new THREE.Vector2();
//     const intersectionPoint = new THREE.Vector3();
//     const planeNormal = new THREE.Vector3();
//     const plane = new THREE.Plane();
//     const raycaster = new THREE.Raycaster();

//     window.addEventListener("click", function (e) {
//       mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
//       mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
//       planeNormal.copy(camera.position).normalize();
//       plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
//       raycaster.setFromCamera(mouse, camera);
//       raycaster.ray.intersectPlane(plane, intersectionPoint);
//       const sphereMesh = new THREE.Mesh(
//         new THREE.SphereGeometry(0.125, 30, 30),
//         new THREE.MeshStandardMaterial({
//           color: 0xffea00,
//           metalness: 0,
//           roughness: 0
//         })
//       );
//       scene.add(sphereMesh);
//         sphereMesh.position.copy(intersectionPoint);
//     });

//     // Função de renderização
//     const animate = () => {
//       requestAnimationFrame(animate);
//       renderer.render(scene, camera);
//     };

//     animate();

//     // Lide com a limpeza quando o componente for desmontado
//     return () => {
//       renderer.dispose();
//     };
//   }, []);

//   return <div ref={containerRef} />;
// };

const ThreeDViewer = ({}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });

    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const orbit = new OrbitControls(camera, renderer.domElement);

    camera.position.set(0, 0, 6);
    orbit.update();

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    scene.add(directionalLight);
    directionalLight.position.set(0, 50, 0);

    const helper = new THREE.AxesHelper(20);
    scene.add(helper);

    const mouse = new THREE.Vector2();
    const intersectionPoint = new THREE.Vector3();
    const planeNormal = new THREE.Vector3();
    const plane = new THREE.Plane();
    const raycaster = new THREE.Raycaster();

    window.addEventListener("click", function (e) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      planeNormal.copy(camera.position).normalize();
      plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, intersectionPoint);
      const sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.125, 30, 30),
        new THREE.MeshStandardMaterial({
          color: 0xffea00,
          metalness: 0,
          roughness: 0
        })
      );
      scene.add(sphereMesh);
      sphereMesh.position.copy(intersectionPoint);
    });

    function animate() {
      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    window.addEventListener("resize", function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    container.appendChild(renderer.domElement);
  });

  return <div ref={containerRef} />;
}

export default withAppContext(ThreeDViewer); // Substitua 'withAppContext' pelo seu HOC real
