import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DirectionalLight } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import bumped from "./helvetiker_regular.typeface.json";

const ObjectPointMapper = ({ url, fileType, onObject3DClick, idx, pontos, partes, enableOnClick }) => {
  const containerRef = useRef(null);
  const [loadedModel, setLoadedModel] = useState(null);

  const mouse = new THREE.Vector2();
  const intersectionPoint = new THREE.Vector3();
  const planeNormal = new THREE.Vector3();
  const plane = new THREE.Plane();
  const raycaster = new THREE.Raycaster();

  useEffect(() => {
    if (!loadedModel) {
      return;
    }

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5);
    container.appendChild(renderer.domElement);

    scene.add(loadedModel);

    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // Adiciona eixos
    const helper = new THREE.AxesHelper(20);
    scene.add(helper);

    camera.position.z = 5; // Ajuste o zoom inicial conforme necessário

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    console.log('Partes: ', partes);
    console.log('Pontos: ', pontos);

    pontos.map((ponto, i)=> {
      const sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 30, 30),
        new THREE.MeshStandardMaterial({
          color: 0xde0b0b,
          metalness: 0,
          roughness: 0
        })
      );

      let font = new FontLoader().parse(bumped);
      // Adiciona texto à esfera
      const textGeometry = new TextGeometry(ponto.label.toString(), {
        font: font,
        size: 0.2, // Tamanho do texto
        height: 0.05 // Espessura do texto
      });

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      // Posiciona o texto
      textMesh.position.set(0, 0.4, 0); // Ajuste conforme necessário

      // Adiciona o texto como filho da esfera
      sphereMesh.add(textMesh);

      sphereMesh.position.x = ponto.x
      sphereMesh.position.y = ponto.y
      sphereMesh.position.z = ponto.z

      scene.add(sphereMesh);
    });

    animate();

    window.addEventListener("dblclick",  (e) => {
      console.log('Partes: ', partes);
      console.log('Pontos: ', pontos);

      if (pontos.length < partes.length && enableOnClick) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects([loadedModel], true);

        if (intersects.length > 0) {
          planeNormal.copy(camera.position).normalize();
          plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
          raycaster.ray.intersectPlane(plane, intersectionPoint);

          const sphereMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 30, 30),
            new THREE.MeshStandardMaterial({
              color: 0xde0b0b,
              metalness: 0,
              roughness: 0
            })
          );
          scene.add(sphereMesh);
          sphereMesh.position.copy(intersectionPoint);

          let font = new FontLoader().parse(bumped);
          // Adiciona texto à esfera
          const textGeometry = new TextGeometry(getNextLabel(), {
            font: font,
            size: 0.2, // Tamanho do texto
            height: 0.05 // Espessura do texto
          });

          const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);

          // Posiciona o texto
          textMesh.position.set(0, 0.4, 0); // Ajuste conforme necessário

          // Adiciona o texto como filho da esfera
          sphereMesh.add(textMesh);

          console.log('INTERSECTION POINT', intersectionPoint);
          onObject3DClick(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z, idx);
        }
      }
    });

    window.addEventListener("resize", function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5);
    });

    return () => {
      // Limpe a cena e remova o modelo quando o componente for desmontado
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
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

  const getNextLabel = () => {
    let maiorLabel = 0;
    pontos.map((ponto) => {
      if (ponto.label > maiorLabel) {
        maiorLabel = ponto.label;
      }
    });
    maiorLabel++;
    return maiorLabel.toString();
  }

  return (
    <div>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default ObjectPointMapper;
