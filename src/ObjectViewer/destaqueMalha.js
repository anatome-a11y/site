import * as THREE from 'three';

// A chave da malha é o caminho na hierarquia do arquivo (nome + índice entre
// irmãos). O app repete esta função em visualizadorHtml.js: os dois lados
// precisam gerar a mesma string para o destaque salvo no site aparecer lá.
export const chaveMalha = mesh => {
  const partes = [];
  let atual = mesh;
  while (atual) {
    const nome = (atual.name || '').trim() || 'malha';
    // A raiz do arquivo entra com um marcador fixo. O índice dela na cena do
    // viewer muda conforme luzes e câmera, e não pode fazer parte da chave.
    if (!atual.parent || atual.parent.isScene) {
      partes.unshift(`${nome}#raiz`);
      break;
    }
    const indice = atual.parent.children.indexOf(atual);
    partes.unshift(`${nome}#${indice}`);
    atual = atual.parent;
  }
  return partes.join('/');
};

export const contarMalhas = model => {
  let total = 0;
  model.traverse(child => {
    if (child.isMesh && !child.userData.destaqueParte) {
      total += 1;
    }
  });
  return total;
};

export const CORES_PARTE = [
  '#f5222d',
  '#1890ff',
  '#52c41a',
  '#fa8c16',
  '#722ed1',
  '#13c2c2',
  '#eb2f96',
  '#faad14',
  '#2f54eb',
  '#a0d911',
];

export const corDaParte = label => {
  const numero = parseInt(label, 10);
  const indice = Number.isNaN(numero) ? 0 : Math.abs(numero) % CORES_PARTE.length;
  return CORES_PARTE[indice];
};

const ANGULO_REGIAO_GRAUS = 68;
const LIMITE_FACES = 15000;

const indiceVertice = (index, face, vertice) => (
  index ? index.getX(face * 3 + vertice) : face * 3 + vertice
);

const infoFaces = mesh => {
  if (mesh.userData.infoFaces) {
    return mesh.userData.infoFaces;
  }
  const geometry = mesh.geometry;
  const position = geometry && geometry.attributes && geometry.attributes.position;
  if (!position) {
    return null;
  }
  const index = geometry.index;
  const count = index ? index.count / 3 : position.count / 3;
  const centroids = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const normal = new THREE.Vector3();

  for (let face = 0; face < count; face += 1) {
    a.fromBufferAttribute(position, indiceVertice(index, face, 0));
    b.fromBufferAttribute(position, indiceVertice(index, face, 1));
    c.fromBufferAttribute(position, indiceVertice(index, face, 2));
    const offset = face * 3;
    centroids[offset] = (a.x + b.x + c.x) / 3;
    centroids[offset + 1] = (a.y + b.y + c.y) / 3;
    centroids[offset + 2] = (a.z + b.z + c.z) / 3;
    ab.subVectors(b, a);
    ac.subVectors(c, a);
    normal.crossVectors(ab, ac);
    if (normal.lengthSq() < 1e-12) {
      normals[offset] = 0;
      normals[offset + 1] = 0;
      normals[offset + 2] = 1;
    } else {
      normal.normalize();
      normals[offset] = normal.x;
      normals[offset + 1] = normal.y;
      normals[offset + 2] = normal.z;
    }
  }

  const arestas = new Map();
  const registrarAresta = (i, j, face) => {
    const chave = i < j ? `${i}_${j}` : `${j}_${i}`;
    const lista = arestas.get(chave);
    if (lista) {
      lista.push(face);
    } else {
      arestas.set(chave, [face]);
    }
  };
  for (let face = 0; face < count; face += 1) {
    const i0 = indiceVertice(index, face, 0);
    const i1 = indiceVertice(index, face, 1);
    const i2 = indiceVertice(index, face, 2);
    registrarAresta(i0, i1, face);
    registrarAresta(i1, i2, face);
    registrarAresta(i2, i0, face);
  }

  const vizinhos = new Array(count);
  for (let face = 0; face < count; face += 1) {
    vizinhos[face] = [];
  }
  arestas.forEach(lista => {
    for (let i = 0; i < lista.length; i += 1) {
      for (let j = i + 1; j < lista.length; j += 1) {
        vizinhos[lista[i]].push(lista[j]);
        vizinhos[lista[j]].push(lista[i]);
      }
    }
  });

  const info = { count, centroids, normals, vizinhos };
  mesh.userData.infoFaces = info;
  return info;
};

// Faces cuja centroide está dentro do raio (em coordenadas locais da malha),
// alcançadas a partir da face clicada.
export const coletarPincel = (mesh, faceIndex, localPoint, raio, destino) => {
  const info = infoFaces(mesh);
  if (!info || faceIndex == null || faceIndex < 0 || faceIndex >= info.count) {
    return destino;
  }
  const raio2 = raio * raio;
  const vistos = new Set();
  const pilha = [faceIndex];
  while (pilha.length && destino.size < LIMITE_FACES) {
    const face = pilha.pop();
    if (vistos.has(face) || face < 0 || face >= info.count) {
      continue;
    }
    vistos.add(face);
    const offset = face * 3;
    const dx = info.centroids[offset] - localPoint.x;
    const dy = info.centroids[offset + 1] - localPoint.y;
    const dz = info.centroids[offset + 2] - localPoint.z;
    // A face sob o cursor entra mesmo se a centroide ficar fora do raio do pincel.
    if (face !== faceIndex && dx * dx + dy * dy + dz * dz > raio2) {
      continue;
    }
    destino.add(face);
    const proximos = info.vizinhos[face];
    for (let i = 0; i < proximos.length; i += 1) {
      pilha.push(proximos[i]);
    }
  }
  return destino;
};

// Mancha contínua em volta do clique: para de crescer quando a normal muda
// demais ou a face sai do raio. Serve para um clique delimitar uma região
// numa malha única, sem o usuário precisar contornar triângulo por triângulo.
export const coletarRegiao = (mesh, faceIndex, localPoint, raio) => {
  const destino = new Set();
  const info = infoFaces(mesh);
  if (!info || faceIndex == null || faceIndex < 0 || faceIndex >= info.count) {
    return destino;
  }
  const semente = faceIndex * 3;
  const nx = info.normals[semente];
  const ny = info.normals[semente + 1];
  const nz = info.normals[semente + 2];
  const limite = Math.cos(THREE.MathUtils.degToRad(ANGULO_REGIAO_GRAUS));
  const raio2 = raio * raio;
  const pilha = [faceIndex];
  destino.add(faceIndex);
  while (pilha.length && destino.size < LIMITE_FACES) {
    const face = pilha.pop();
    const proximos = info.vizinhos[face];
    for (let i = 0; i < proximos.length; i += 1) {
      const vizinho = proximos[i];
      if (destino.has(vizinho)) {
        continue;
      }
      const offset = vizinho * 3;
      const alinhamento = info.normals[offset] * nx
        + info.normals[offset + 1] * ny
        + info.normals[offset + 2] * nz;
      if (alinhamento < limite) {
        continue;
      }
      const dx = info.centroids[offset] - localPoint.x;
      const dy = info.centroids[offset + 1] - localPoint.y;
      const dz = info.centroids[offset + 2] - localPoint.z;
      if (dx * dx + dy * dy + dz * dz > raio2) {
        continue;
      }
      destino.add(vizinho);
      pilha.push(vizinho);
    }
  }
  return destino;
};

export const raioLocal = (mesh, raioMundo) => {
  mesh.updateWorldMatrix(true, false);
  const escala = new THREE.Vector3();
  mesh.getWorldScale(escala);
  const maior = Math.max(Math.abs(escala.x), Math.abs(escala.y), Math.abs(escala.z), 1e-6);
  return raioMundo / maior;
};

export const pontoLocal = (mesh, pontoMundo) => {
  mesh.updateWorldMatrix(true, false);
  return mesh.worldToLocal(pontoMundo.clone());
};

const criarOverlay = (mesh, faces, cor) => {
  const geometry = mesh.geometry;
  const position = geometry.attributes.position;
  const index = geometry.index;
  const lista = Array.isArray(faces) ? faces : Array.from(faces);
  const coords = new Float32Array(lista.length * 9);
  let offset = 0;
  lista.forEach(face => {
    for (let vertice = 0; vertice < 3; vertice += 1) {
      const indice = indiceVertice(index, face, vertice);
      coords[offset] = position.getX(indice);
      coords[offset + 1] = position.getY(indice);
      coords[offset + 2] = position.getZ(indice);
      offset += 3;
    }
  });
  const overlayGeometry = new THREE.BufferGeometry();
  overlayGeometry.setAttribute('position', new THREE.BufferAttribute(coords, 3));
  const material = new THREE.MeshBasicMaterial({
    color: cor,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
    toneMapped: false,
  });
  const overlay = new THREE.Mesh(overlayGeometry, material);
  overlay.name = 'destaque-parte';
  overlay.userData.destaqueParte = true;
  overlay.renderOrder = 2;
  return overlay;
};

export const contornoFechado = (pontos, toleranciaPx) => {
  if (!pontos || pontos.length < 4) {
    return false;
  }
  const inicio = pontos[0];
  const fim = pontos[pontos.length - 1];
  return Math.hypot(inicio.x - fim.x, inicio.y - fim.y) <= toleranciaPx;
};

export const pontoNoPoligono = (x, y, poligono) => {
  let dentro = false;
  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i, i += 1) {
    const xi = poligono[i].x;
    const yi = poligono[i].y;
    const xj = poligono[j].x;
    const yj = poligono[j].y;
    const cruza = (yi > y) !== (yj > y)
      && x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-12) + xi;
    if (cruza) {
      dentro = !dentro;
    }
  }
  return dentro;
};

const projetarNaTela = (mundo, camera, rect, destino) => {
  destino.copy(mundo).project(camera);
  if (destino.z < -1 || destino.z > 1) {
    return null;
  }
  return {
    x: (destino.x * 0.5 + 0.5) * rect.width + rect.left,
    y: (-destino.y * 0.5 + 0.5) * rect.height + rect.top,
    profundidade: destino.z,
  };
};

// Faces visíveis cuja projeção cai dentro do contorno desenhado na tela.
// A profundidade acompanha o traço para não pintar o lado de trás da peça.
export const facesDentroDoContorno = (mesh, camera, rect, poligono) => {
  const info = infoFaces(mesh);
  if (!info || !poligono || poligono.length < 3) {
    return [];
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  poligono.forEach(ponto => {
    minX = Math.min(minX, ponto.x);
    minY = Math.min(minY, ponto.y);
    maxX = Math.max(maxX, ponto.x);
    maxY = Math.max(maxY, ponto.y);
    if (ponto.profundidade != null) {
      minZ = Math.min(minZ, ponto.profundidade);
      maxZ = Math.max(maxZ, ponto.profundidade);
    }
  });
  const temProfundidade = minZ !== Infinity;
  const folgaZ = temProfundidade ? Math.max(0.02, (maxZ - minZ) * 0.35) : 0;
  mesh.updateWorldMatrix(true, false);
  const mundo = new THREE.Vector3();
  const projetado = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const destino = [];
  for (let face = 0; face < info.count; face += 1) {
    const offset = face * 3;
    mundo.set(info.centroids[offset], info.centroids[offset + 1], info.centroids[offset + 2]);
    mundo.applyMatrix4(mesh.matrixWorld);
    const tela = projetarNaTela(mundo, camera, rect, projetado);
    if (!tela || tela.x < minX || tela.x > maxX || tela.y < minY || tela.y > maxY) {
      continue;
    }
    if (temProfundidade && (tela.profundidade < minZ - folgaZ || tela.profundidade > maxZ + folgaZ)) {
      continue;
    }
    normal.set(info.normals[offset], info.normals[offset + 1], info.normals[offset + 2]);
    normal.transformDirection(mesh.matrixWorld);
    const paraCameraX = camera.position.x - mundo.x;
    const paraCameraY = camera.position.y - mundo.y;
    const paraCameraZ = camera.position.z - mundo.z;
    if (normal.x * paraCameraX + normal.y * paraCameraY + normal.z * paraCameraZ <= 0) {
      continue;
    }
    if (!pontoNoPoligono(tela.x, tela.y, poligono)) {
      continue;
    }
    destino.push(face);
    if (destino.length >= LIMITE_FACES) {
      break;
    }
  }
  return destino;
};

export const criarTraco = (parent, pontos, cor, raio, marcacao) => {
  const lista = (pontos || [])
    .map(ponto => new THREE.Vector3(Number(ponto.x), Number(ponto.y), Number(ponto.z)))
    .filter(ponto => !Number.isNaN(ponto.x) && !Number.isNaN(ponto.y) && !Number.isNaN(ponto.z));
  if (!parent || lista.length < 2) {
    return null;
  }
  parent.updateWorldMatrix(true, false);
  const locais = lista.map(ponto => parent.worldToLocal(ponto.clone()));
  const curva = locais.length === 2
    ? new THREE.LineCurve3(locais[0], locais[1])
    : new THREE.CatmullRomCurve3(locais, false, 'centripetal');
  const segmentos = Math.min(Math.max(locais.length * 3, 8), 300);
  const geometry = new THREE.TubeGeometry(curva, segmentos, Math.max(raio, 1e-4), 5, false);
  const material = new THREE.MeshBasicMaterial({
    color: cor,
    depthWrite: false,
    transparent: true,
    opacity: 0.95,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'traco-parte';
  mesh.userData.destaqueParte = true;
  mesh.userData.marcacao = marcacao || null;
  mesh.renderOrder = 3;
  parent.add(mesh);
  return mesh;
};

const descartarMaterial = material => {
  if (!material) {
    return;
  }
  const lista = Array.isArray(material) ? material : [material];
  lista.forEach(item => {
    if (item && item.dispose) {
      item.dispose();
    }
  });
};

export const limparDestaques = model => {
  if (!model) {
    return;
  }
  const overlays = [];
  model.traverse(child => {
    if (child.userData && child.userData.destaqueParte) {
      overlays.push(child);
    }
  });
  overlays.forEach(overlay => {
    if (overlay.parent) {
      overlay.parent.remove(overlay);
    }
    if (overlay.geometry) {
      overlay.geometry.dispose();
    }
    descartarMaterial(overlay.material);
  });
  model.traverse(child => {
    if (!child.isMesh || !child.userData || !child.userData.materialOriginal) {
      return;
    }
    const clone = child.material;
    child.material = child.userData.materialOriginal;
    delete child.userData.materialOriginal;
    delete child.userData.marcacao;
    descartarMaterial(clone);
  });
};

const marcacaoDoPonto = ponto => {
  const parte = ponto.parte;
  const parteId = parte && parte._id ? String(parte._id) : (typeof parte === 'string' ? parte : (ponto.parteId || ''));
  const parteNome = parte && parte.nome ? String(parte.nome) : (ponto.parteNome || '');
  return {
    label: ponto.label == null ? '' : String(ponto.label),
    parteId,
    parteNome,
  };
};

export const aplicarDestaques = (model, pontos) => {
  limparDestaques(model);
  if (!model) {
    return;
  }
  const malhas = new Map();
  model.traverse(child => {
    if (child.isMesh && !child.userData.destaqueParte) {
      malhas.set(chaveMalha(child), child);
    }
  });
  (pontos || []).forEach(ponto => {
    if (!ponto) {
      return;
    }
    const cor = corDaParte(ponto.label);
    const marcacao = marcacaoDoPonto(ponto);
    const mesh = ponto.malha ? malhas.get(ponto.malha) : null;
    if (mesh && ponto.faces && ponto.faces.length) {
      const overlay = criarOverlay(mesh, ponto.faces, cor);
      overlay.userData.marcacao = marcacao;
      mesh.add(overlay);
    }
    if (ponto.traco && ponto.traco.length > 1) {
      criarTraco(model, ponto.traco, cor, (model.userData.raioDestaque || 1) * 0.006, marcacao);
    }
  });
};

export const mostrarPrevisao = (mesh, faces, cor) => {
  removerPrevisao(mesh);
  if (!faces || !faces.size) {
    return;
  }
  const overlay = criarOverlay(mesh, faces, cor);
  overlay.userData.previsaoParte = true;
  mesh.add(overlay);
};

export const removerPrevisao = mesh => {
  if (!mesh) {
    return;
  }
  const overlays = mesh.children.filter(child => child.userData && child.userData.previsaoParte);
  overlays.forEach(overlay => {
    mesh.remove(overlay);
    if (overlay.geometry) {
      overlay.geometry.dispose();
    }
    descartarMaterial(overlay.material);
  });
};

export const listaFaces = faces => Array.from(faces).filter(face => face >= 0).sort((a, b) => a - b);
