export const is3dFile = (fileName) => {
  const fileExtension =  getExtensionFromFileName(fileName);
  return is3dFileExtension(fileExtension)
}

export const getExtensionFromFileName = (fileName) => {
  const parts = fileName.split('.');
  if (parts.length > 1) {
    return parts[parts.length - 1].toLowerCase();
  }
  return null;
}

export const is3dFileExtension = (fileExtension) => {
  return ['glb', 'obj', 'gltf'].includes(fileExtension)
}

