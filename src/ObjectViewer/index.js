import React, { useEffect, useRef, useState } from 'react';
import { createViewer, disposeObject, loadModel, statusMessageStyle } from './threeViewer';

const ObjectViewer = ({ url, fileType, height = 200 }) => {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!url) {
      return undefined;
    }

    let cancelled = false;
    let viewer = null;
    setStatus('loading');

    loadModel(url, fileType)
      .then(model => {
        if (cancelled || !containerRef.current) {
          disposeObject(model);
          return;
        }
        viewer = createViewer(containerRef.current, model);
        if (cancelled) {
          viewer.dispose();
          viewer = null;
          return;
        }
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
      if (viewer) {
        viewer.dispose();
        viewer = null;
      }
    };
  }, [url, fileType]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height }}>
      {status === 'loading' && <div style={statusMessageStyle}>Carregando modelo 3D...</div>}
      {status === 'error' && <div style={statusMessageStyle}>Não foi possível carregar o modelo 3D.</div>}
    </div>
  );
};

export default ObjectViewer;
