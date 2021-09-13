import React from 'react';

import { Title } from '../components/shared/Title';
import { RadarContext } from '../services/RadarContext';

import './RadarSvg.scss';
import style from './Radar.module.scss';
import { RadarRenderUtils } from './utilities/RadarRenderUtils';

export const Radar: React.FC = () => {
  const radarRef = React.createRef<HTMLDivElement>();
  const radarContext = React.useContext(RadarContext);

  // On radar ref
  React.useEffect(() => {
    if (radarRef.current && radarContext) {
      const newContext = { ...radarContext };
      newContext.data.height = radarRef.current.clientHeight;
      newContext.data.width = radarRef.current.clientWidth;
      RadarRenderUtils.setupFourQuadrants(radarRef.current, radarContext);
    }
  }, [radarRef]);

  return (
    <>
      <Title label={radarContext.data.title} />
      <div style={{ padding: 10 }}>
        <div className={style.techradar} ref={radarRef} />
      </div>
    </>
  );
};
