import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DirectionalLight } from 'three';

const ObjectViewer = ({ url, fileType }) => {
  const containerRef = useRef(null);
  const [loadedModel, setLoadedModel] = useState(null);

  useEffect(() => {
    if (!loadedModel) {
      return;
    }

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5);
    container.appendChild(renderer.domElement);

    scene.add(loadedModel);

    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    camera.position.z = 10;
    
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  }, [loadedModel]);

  useEffect(() => {
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
    </div>
  );
};

export default ObjectViewer;