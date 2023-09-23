import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DirectionalLight } from 'three'; // Importe a luz direcional
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { withAppContext } from '../context';

const ThreeDViewer = ({ /* props adicionais do contexto */ }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    // Crie uma cena, uma câmera e um renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Carregue o arquivo 3D usando um loader (por exemplo, GLTFLoader)
    const loader = new GLTFLoader();
    loader.load('./shoe.gltf', (gltf) => {
      const model = gltf.scene;
      scene.add(model);
    });

    // Adicione luzes, controles de câmera ou outras configurações da cena aqui
     // Adicione uma luz direcional
     const light = new DirectionalLight(0xffffff, 1); // Cor e intensidade da luz
     light.position.set(1, 1, 1); // Posição da luz (x, y, z)
     scene.add(light); // Adiciona a luz à cena

    // Inicialize os controles de câmera (opcional)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // Configure a posição inicial da câmera
    camera.position.z = 5;

    // Função de renderização
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Lide com a limpeza quando o componente for desmontado
    return () => {
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} />;
};

export default withAppContext(ThreeDViewer); // Substitua 'withAppContext' pelo seu HOC real
