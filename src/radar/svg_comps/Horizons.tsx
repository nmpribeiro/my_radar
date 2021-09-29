import React from 'react';
// import * as d3 from 'd3';

interface Props {
  quadrant: QuadrantKey | null;
  context: RadarDataBlipsAndLogic;
}

export const Horizons: React.FC<Props> = ({ quadrant, context }) => {
  const { width, height } = context.radarData;
  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;
  const horizonUnit = (horizonWidth - context.radarData.radarOptions.horizonShiftRadius) / context.radarData.horizons.length;
  // const quadAngle = (2 * Math.PI) / context.radarData.quadrants.length;
  // const thisColorScale = d3.scaleOrdinal(d3.schemePastel1);
  const data = context.radarData;

  if (quadrant) {
    return (
      <g>
        {context.radarData.horizons.map((h, i) => (
          <circle
            key={h}
            r={(i + 1) * horizonUnit + data.radarOptions.horizonShiftRadius}
            cx={0}
            cy={0}
            fill="none"
            stroke="grey"
            className="horizon"
          />
        ))}
      </g>
    );
  }
  return <></>;
};
