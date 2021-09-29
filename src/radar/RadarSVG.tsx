import React, { useEffect, useLayoutEffect, useState } from 'react';
import { select } from 'd3';

import { Translate } from './svg_comps/Translate';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

interface Props {
  quadrant: QuadrantKey;
  context: RadarDataBlipsAndLogic;
}

export const RadarSVG: React.FC<Props> = ({ quadrant, context }) => {
  const ref = React.useRef(null);

  const [radarWidth, setRadarWidth] = useState(0);
  const [radarScale, setRadarScale] = useState(0);

  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  React.useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useLayoutEffect(() => {
    const svg = select(ref.current);

    const { width, height } = context.radarData;
    svg.attr('width', width || DEFAULT_WIDTH).attr('height', height || DEFAULT_HEIGHT);
  }, [radarScale, dimensions]);

  // on mount
  useEffect(() => {}, []);

  return (
    <svg ref={ref}>
      <marker id="arrow" orient="auto" markerWidth="2" markerHeight="4" refX={0.1} refY={2}>
        <path d="M0,0 V4 L2,2 Z" />
      </marker>
      <Translate x={(context.radarData.width || DEFAULT_WIDTH) / 2} y={(context.radarData.height || DEFAULT_HEIGHT) / 2}>
        <></>
      </Translate>
    </svg>
  );
};
