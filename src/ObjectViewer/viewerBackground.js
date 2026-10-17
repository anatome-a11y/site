import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'tcc.objectViewer.background';

// Cinza médio é o padrão: separa peças claras do card branco e ainda
// deixa peças escuras legíveis. A escolha vale para a aba inteira.
export const VIEWER_BACKGROUNDS = [
  { id: 'white', label: 'Branco', color: '#ffffff', dark: false },
  { id: 'gray', label: 'Cinza', color: '#8e8e8e', dark: true },
  { id: 'dark', label: 'Escuro', color: '#2c2c2c', dark: true },
  { id: 'slate', label: 'Azul-ardósia', color: '#4a6274', dark: true },
];

const DEFAULT_ID = 'gray';
const listeners = new Set();

const readId = () => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (VIEWER_BACKGROUNDS.some(option => option.id === saved)) {
      return saved;
    }
  } catch (error) {
    // sessionStorage pode estar bloqueado; segue com o padrão.
  }
  return DEFAULT_ID;
};

export const getViewerBackground = id => (
  VIEWER_BACKGROUNDS.find(option => option.id === id)
  || VIEWER_BACKGROUNDS.find(option => option.id === DEFAULT_ID)
);

export const setViewerBackground = id => {
  if (!VIEWER_BACKGROUNDS.some(option => option.id === id)) {
    return;
  }
  try {
    sessionStorage.setItem(STORAGE_KEY, id);
  } catch (error) {
    // A troca ainda vale nos viewers abertos nesta página.
  }
  listeners.forEach(listener => listener(id));
};

export const useViewerBackground = () => {
  const [id, setId] = useState(readId);

  useEffect(() => {
    const listener = nextId => setId(nextId);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return [getViewerBackground(id), setViewerBackground];
};

export const viewerStatusColor = background => (
  background.dark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.45)'
);

const stopPointer = event => {
  event.stopPropagation();
};

export const ViewerBackgroundControl = ({ value, onChange }) => (
  <div
    role="group"
    aria-label="Cor de fundo da visualização"
    onPointerDown={stopPointer}
    onClick={stopPointer}
    style={{
      position: 'absolute',
      top: 6,
      right: 6,
      zIndex: 2,
      display: 'flex',
      padding: 3,
      borderRadius: 4,
      background: 'rgba(255, 255, 255, 0.88)',
      boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.15)',
    }}
  >
    {VIEWER_BACKGROUNDS.map((option, index) => {
      const selected = option.id === value;
      return (
        <button
          key={option.id}
          type="button"
          title={option.label}
          aria-label={option.label}
          aria-pressed={selected}
          onClick={() => onChange(option.id)}
          style={{
            width: 14,
            height: 14,
            marginLeft: index === 0 ? 0 : 4,
            padding: 0,
            boxSizing: 'border-box',
            borderRadius: '50%',
            border: '1px solid rgba(0, 0, 0, 0.45)',
            outline: selected ? '2px solid #1890ff' : 'none',
            outlineOffset: 1,
            background: option.color,
            cursor: 'pointer',
          }}
        />
      );
    })}
  </div>
);
