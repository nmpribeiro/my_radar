import React from 'react';

import { RAW_BLIP_DATA, RADAR_DATA } from '../../constants/RadarData';

import style from './Radar.module.scss';
import './RadarSvg.scss';
import { RadarRenderUtils } from './utilities/RadarRenderUtils';

export const Radar: React.FC = () => {
  const radarRef = React.createRef<HTMLDivElement>();

  // On radar ref
  React.useEffect(() => {
    if (radarRef.current) {
      RadarRenderUtils.setupForQuadrants(radarRef.current, RADAR_DATA, RAW_BLIP_DATA);
    }
  }, [radarRef]);

  return <div className={style.techradar} ref={radarRef} />;
};
