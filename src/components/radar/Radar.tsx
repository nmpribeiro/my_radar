import React from 'react';

import { RadarService } from './RadarService';
import { Data, RadarApi } from './RadarApi';
import style from './Radar.module.scss';
import './RadarSvg.scss';

const DATA: Data[] = [];

DATA.push({
  text: 'A point',
  circle: 2,
  quadrant: 1,
});

export const Radar = () => {
  const radarRef = React.createRef<SVGSVGElement>();

  // On radar ref
  React.useEffect(() => {
    if (radarRef.current) {
      RadarService.render(radarRef.current, RadarApi.cleanData(DATA), {
        horizons: ['discover', 'assess', 'learn', 'use'],
        quadrants: ['languages', 'frameworks', 'tools', 'big data'],
        width: 850,
        height: 850,
      });
    }
  }, [radarRef]);

  return (
    <div className={style.techradar__chart}>
      <div className={style.chart}>
        <svg ref={radarRef} />
      </div>
    </div>
  );
};
