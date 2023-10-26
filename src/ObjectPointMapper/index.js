import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DirectionalLight } from 'three';
import { Raycaster } from 'three';

const ObjectPointMapper = ({ url, fileType, onObject3DClick, idx }) => {
  const containerRef = useRef(null);
  const [loadedModel, setLoadedModel] = useState(null);
  const raycaster = new Raycaster();
  const textLabel = useRef(null);
  const textDiv = useRef(null);

  useEffect(() => {
    if (!loadedModel) {
      return;
    }

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5);
    container.appendChild(renderer.domElement);

    scene.add(loadedModel);

    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    camera.position.z = 5; // Ajuste o zoom inicial conforme necessário

    textDiv.current = document.createElement('div');
    textDiv.current.textContent = 'X';
    textDiv.current.style.position = 'absolute';
    textDiv.current.style.color = 'white';
    textDiv.current.style.display = 'none';
    textLabel.current.appendChild(textDiv.current);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    container.addEventListener('click', (event) => {
      console.log('Clique detectado');

      if (loadedModel) {
        // TESTE
        // const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        // const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const containerRect = container.getBoundingClientRect();
        const containerX = containerRect.left;
        const containerY = containerRect.top;

        // Calcula a posição relativa ao contêiner
        const relativeX = mouseX - containerX;
        const relativeY = mouseY - containerY;

        raycaster.setFromCamera(
          { 
            x: (relativeX / container.clientWidth) * 2 - 1,
            y: -(relativeY / container.clientHeight) * 2 + 1 
          }, 
          camera
        );
        const intersects = raycaster.intersectObjects([loadedModel], true);
    
        if (intersects.length > 0) {
          const intersection = intersects[0];
          const point = intersection.point;
          console.log("PONTO ", point)
          console.log("mouseX ", mouseX)
          console.log("mouseY ", mouseY)

          // Defina as coordenadas left e top para o ponto de interseção
          textDiv.current.style.left = `${mouseX}px`;
          textDiv.current.style.top = `${mouseY}px`;
          textDiv.current.style.display = 'block';

          onObject3DClick(mouseX, mouseY, idx)

          //TESTE esse deu ruim
          //textDiv.style.transform = `translate(-50%, -50%) translate(${point.x}px, ${point.y}px)`;
        }
      }
    });

    return () => {
      // Limpe a cena e remova o modelo quando o componente for desmontado
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [loadedModel]);

  useEffect(() => {
    if (textDiv.current) {
      textDiv.current.style.display = 'none';
    }

    if (url) {
      if (fileType === 'glb') {
        const loader = new GLTFLoader();
        loader.load(url, (gltf) => {
          setLoadedModel(gltf.scene);
        });
      } else if (fileType === 'obj') {
        const loader = new OBJLoader();
        loader.load(url, (obj) => {
          setLoadedModel(obj);
        });
      }
    }
  }, [url, fileType]);

  return (
    <div>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <div ref={textLabel} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />
    </div>
  );
};

export default ObjectPointMapper;
