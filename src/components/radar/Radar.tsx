import React from 'react';
import * as d3 from 'd3';

import { RadarService } from './RadarService';
import { Data, Dot, RadarApi } from './RadarApi';
import style from './Radar.module.scss';

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
      RadarService.create(radarRef.current, RadarApi.cleanData(DATA));
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
