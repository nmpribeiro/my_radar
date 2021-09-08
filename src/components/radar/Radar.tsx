import React from 'react';

import { RAW_BLIP_DATA, RADAR_DATA } from '../../constants/RadarData';

import { Radar as RadarUtils } from './utilities/RadarUtilities';
import style from './Radar.module.scss';
import './RadarSvg.scss';

export const Radar: React.FC = () => {
  const radarRef = React.createRef<HTMLDivElement>();

  // On radar ref
  React.useEffect(() => {
    if (radarRef.current) {
      RadarUtils.setupForQuadrants(radarRef.current, RADAR_DATA, RAW_BLIP_DATA);
    }
  }, [radarRef]);

  return (
    <div className={style.techradar__chart}>
      <div className={style.chart} ref={radarRef} />
    </div>
  );
};
