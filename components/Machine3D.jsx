'use client';

import { Component } from 'react';
import dynamic from 'next/dynamic';
import { img } from '@/lib/site';

class Guard extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.warn('3D viewer unavailable, showing photo instead:', err?.message);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const ModelViewer = dynamic(() => import('./reactbits/ModelViewer/ModelViewer'), {
  ssr: false,
  loading: () => <div className="machine3d__loading" aria-hidden="true" />
});

export default function Machine3D({ url = '/models/bu100e.glb', photo = '2023/08/BU100E-_-BU100EW.png', height = 520, label = 'Modelo 3D do purificador Triple R BU100E', hint = 'Arraste para girar · duplo clique para centralizar' }) {
  return (
    <figure className="machine3d" aria-label={label}>
      <div className="machine3d__stage" style={{ height }}>
        <Guard fallback={<img src={img(photo)} alt={label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}>
        <ModelViewer
          url={url}
          width="100%"
          height="100%"
          environment="studio-local"
          environmentIntensity={0.9}
          exposure={1.05}
          autoRotate
          autoRotateSpeed={0.45}
          autoRotateDelay={1.2}
          intro="spin"
          startAngle={-28}
          tilt={8}
          float={0.35}
          fit={0.82}
          shadow
          shadowOpacity={0.5}
          hoverTilt={0.12}
        />
        </Guard>
      </div>
      {hint ? <figcaption>{hint}</figcaption> : null}
    </figure>
  );
}
