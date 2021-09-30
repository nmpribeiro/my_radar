import React, { useEffect, useState } from 'react';

import { Translate } from './svg_comps/Translate';
import { Horizons } from './svg_comps/Horizons';

interface Props {
  quadrant?: QuadrantKey;
  context: RadarDataBlipsAndLogic;
  minHeight?: number;
}

export const RadarSVG: React.FC<Props> = ({ quadrant = null, context, minHeight = undefined }) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const ref = React.useRef<SVGSVGElement>(null);

  const [svgWidth, setSvgWidth] = useState(context.radarData.width);
  const [svgHeight, setSvgHeight] = useState(context.radarData.height);

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

  useEffect(() => {
    if (wrapperRef.current) {
      setSvgWidth(wrapperRef.current.clientWidth - 20);
      setSvgHeight(wrapperRef.current.clientHeight);
    }
  }, [wrapperRef.current, dimensions]);

  return (
    <div ref={wrapperRef} style={{ width: '100%', minHeight }}>
      <svg ref={ref} width={svgWidth} height={svgHeight}>
        <Translate x={svgWidth / 2} y={svgHeight / 2}>
          <Horizons quadrant={quadrant} context={context} />
        </Translate>
      </svg>
    </div>
  );
};