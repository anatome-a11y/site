import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DirectionalLight } from 'three';

import texture from './MT_Stylized_Skull_normal.png';

const ThreeDViewerWithFileUpload = () => {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [loadedModel, setLoadedModel] = useState(null);
  const [annotations, setAnnotations] = useState([]); // Array para armazenar as marcações
  const [annotationCount, setAnnotationCount] = useState(1); // Inicialize o contador em 1

  useEffect(() => {
    const container = containerRef.current;

    // Crie uma cena, uma câmera e um renderizador
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
  
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Carregue o arquivo 3D usando um loader (GLTFLoader) quando o arquivo for carregado
    if (loadedModel) {
      scene.add(loadedModel);
    }

    // Função para lidar com cliques
    const handleClick = (event) => {
      if (!loadedModel) {
        return;
      }

      // Calcula a posição do clique em relação à janela
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Atualiza as coordenadas do mouse
      mouse.set(x, y);

      // Atualiza o raio do mouse
      raycaster.setFromCamera(mouse, camera);

      // Encontra objetos intersectados
      const intersects = raycaster.intersectObjects(loadedModel.children, true);

      if (intersects.length > 0) {
        const intersection = intersects[0];

        // Cria a marcação numerada
        const annotation = createAnnotation(intersection.point, annotationCount);
        setAnnotations([...annotations, annotation]); // Adiciona a marcação à lista

        // Incrementa o contador de marcações
        setAnnotationCount(annotationCount + 1);
      }
    };

    // Event listener para cliques
    // window.addEventListener('click', handleClick); // TODO: retirar comentário

    // Adicione uma luz direcional
    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    // const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Cor da luz ambiente e intensidade
    // scene.add(ambientLight);

    // Inicialize os controles de câmera (OrbitControls)
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
      window.removeEventListener('click', handleClick);
      renderer.dispose();
    };
  }, [loadedModel, annotations, annotationCount]);

  // Função para criar uma marcação numerada
  const createAnnotation = (position, number) => {
    const loader = new THREE.TextureLoader();
    const textTexture = loader.load(texture); // Carregue a textura de texto aqui

    const material = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(1, 1); // Tamanho do texto
    const textMesh = new THREE.Mesh(geometry, material);

    // Posicione o texto na posição do clique
    textMesh.position.copy(position);

    // Retorne o objeto da marcação
    return textMesh;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const loader = new GLTFLoader();
      loader.load(URL.createObjectURL(file), (gltf) => {
        setLoadedModel(gltf.scene);
      });
    }
  };

  return (
    <div>
      <input type="file" accept=".glb, .gltf" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
      <button onClick={() => fileInputRef.current.click()}>Carregar arquivo 3D</button>
      <div style={{ width: '80%', height: '50%' }}> 
        <div ref={containerRef} style={{ width: '75%', height: '50%' }} /> 
      </div>
    </div>
  );
};

export default ThreeDViewerWithFileUpload;