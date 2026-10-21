import React, { useEffect, useRef, useState } from 'react';
import { createViewer, disposeObject, loadModel, loadingLabel, statusMessageStyle } from './threeViewer';
import { useViewerBackground, ViewerBackgroundControl, viewerStatusColor } from './viewerBackground';

const ObjectViewer = ({ url, fileType, height = 200 }) => {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [progresso, setProgresso] = useState(0);
  const [background, setBackground] = useViewerBackground();

  useEffect(() => {
    if (!url) {
      return undefined;
    }

    let cancelled = false;
    let viewer = null;
    setStatus('loading');
    setProgresso(0);

    let ultimo = -1;
    loadModel(url, fileType, percent => {
      if (cancelled || percent === ultimo) return;
      ultimo = percent;
      setProgresso(percent);
    })
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

  const messageStyle = { ...statusMessageStyle, zIndex: 2, color: viewerStatusColor(background) };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height, backgroundColor: background.color }}
    >
      <ViewerBackgroundControl value={background.id} onChange={setBackground} />
      {status === 'loading' && <div style={messageStyle}>{loadingLabel(progresso)}</div>}
      {status === 'error' && <div style={messageStyle}>Não foi possível carregar o modelo 3D.</div>}
    </div>
  );
};

export default ObjectViewer;
