import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DirectionalLight } from 'three';
import { getExtensionFromFileName } from '../utils/fileUtils';

import texture from './textura_fonte.png';

const ThreeDViewerWithFileUpload = () => {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [loadedModel, setLoadedModel] = useState(null);
  const [annotationCount, setAnnotationCount] = useState(1);

  useEffect(() => {
    if (!loadedModel) {
      return;
    }

    const container = containerRef.current;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth*0.5, window.innerHeight*0.5);
    container.appendChild(renderer.domElement);

    scene.add(loadedModel);

    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    camera.position.z = 1;

    const annotationsGroup = new THREE.Group(); // Grupo para armazenar as anotações

    const handleClick = (event) => {
      if (!loadedModel) {
        return;
      }

      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      mouse.set(x, y);
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(loadedModel.children, true);

      if (intersects.length > 0) {
        const intersection = intersects[0];

        const annotation = createAnnotation(intersection.point, annotationCount);

        // Adicione a nova anotação ao grupo de anotações
        annotationsGroup.add(annotation);

        // Atualize a cena
        scene.add(annotationsGroup);

        // Incrementa o contador de anotações
        setAnnotationCount(annotationCount + 1);
      }
    };

    //window.addEventListener('click', handleClick); // TODO: descomentar

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('click', handleClick);
      renderer.dispose();
    };
  }, [loadedModel, annotationCount]);

  const createAnnotation = (position, number) => {
    const loader = new THREE.TextureLoader();
    const textTexture = loader.load(texture);

    const material = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(1, 1);
    const textMesh = new THREE.Mesh(geometry, material);

    textMesh.position.copy(position);

    return textMesh;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) { 
      const file_extension = getExtensionFromFileName(file.name);
      if (['gltf', 'glb'].includes(file_extension)) {
        const loader = new GLTFLoader();
        loader.load(URL.createObjectURL(file), (gltf) => {
          setLoadedModel(gltf.scene);
        });
      } else if (file_extension === 'obj') {
        const loader = new OBJLoader();
        loader.load(URL.createObjectURL(file), (obj) => {
          setLoadedModel(obj);
        });
      }
    }
  };

  return (
    <div>
      <input type="file" accept=".glb, .gltf, .obj" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
      <button onClick={() => fileInputRef.current.click()}>Carregar arquivo 3D</button>
      {loadedModel ? (
        <div style={{ width: '80%', height: '50%' }}>
          <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        </div>
      ) : null}
    </div>
  );
};

export default ThreeDViewerWithFileUpload;