/* eslint-disable no-plusplus */
import React from 'react';

import { RadarUtilities } from '../utilities/Utilities';

interface Props {
  quadrant: QuadrantKey | null;
  context: RadarDataBlipsAndLogic;
}

const SCALE_FAC = 1.5;

export const Horizons: React.FC<Props> = ({ quadrant, context }) => {
  const { radarData } = context;
  const { width, height, radarOptions, horizons, quadrants } = radarData;
  const { horizonShiftRadius } = radarOptions;
  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;
  const horizonUnit = (horizonWidth - horizonShiftRadius) / horizons.length;
  // const quadAngle = (2 * Math.PI) / quadrants.length;
  // const thisColorScale = d3.scaleOrdinal(d3.schemePastel1);
  // const data = radarData;

  const quads: QuadsType[] = [];
  for (let i = 0, ilen = quadrants.length; i < ilen; i++) {
    if (quadrants[i] === quadrant)
      for (let j = 0, jlen = horizons.length; j < jlen; j++) {
        quads.push({
          quadrant: i,
          horizon: j,
          label: quadrants[i],
        });
      }
  }

  const quadrantIndex = quadrant && context.radarData.quadrants.indexOf(quadrant);
  const getX = () => {
    switch (quadrantIndex) {
      case 0:
        return -context.radarData.width / 3.25;
      case 1:
        return -context.radarData.width / 3.25;
      case 2:
        return context.radarData.width / 3.25;
      case 3:
        return context.radarData.width / 3.25;
      default:
        return 0;
    }
  };

  const getY = () => {
    switch (quadrantIndex) {
      case 0:
        return context.radarData.height / 2.5;
      case 1:
        return -context.radarData.height / 2.5;
      case 2:
        return -context.radarData.height / 2.5;
      case 3:
        return context.radarData.height / 2.5;
      default:
        return 0;
    }
  };

  const getTextX = (i: number) => {
    switch (quadrantIndex) {
      case 0:
      case 1:
        return ((i + 1) * horizonUnit - horizonUnit / 2 + (i === 0 ? horizonShiftRadius / 2 : horizonShiftRadius)) * SCALE_FAC;
      case 2:
      case 3:
        return -((i + 1) * horizonUnit - horizonUnit / 2 + (i === 0 ? horizonShiftRadius / 2 : horizonShiftRadius)) * SCALE_FAC;
      default:
        return 0;
    }
  };

  const getTextY = () => {
    switch (quadrantIndex) {
      case 0:
        return 20;
      case 1:
        return -10;
      case 2:
        return -10;
      case 3:
        return 20;
      default:
        return 0;
    }
  };

  if (quadrant) {
    return (
      <g transform={`translate(${getX()}, ${getY()})`}>
        {quads.map((h, i) => (
          <React.Fragment key={`${h.label}-${h.quadrant}-${h.horizon}`}>
            {/* <text className={`quadrant-text quadrant-${h.label}`} dx={getDx()} dy={getDy()} textAnchor={getLabelAnchor()}>
              {h.label.charAt(0).toUpperCase() + h.label.slice(1)}
            </text> */}
            <text className={`horizon-text horizon-${horizons[h.horizon]}`} textAnchor="middle" dx={getTextX(i)} dy={getTextY()}>
              {RadarUtilities.capitalize(horizons[h.horizon])}
            </text>
            {/* TODO: remove path stroke and add lines to be consistent */}
            <path
              d={RadarUtilities.quadrants.drawArcs(h, horizonUnit, horizonShiftRadius, SCALE_FAC) || undefined}
              fill={RadarUtilities.quadrants.fillArcs(h, quadrants)?.toString()}
              stroke="grey"
              strokeWidth={0.5}
              // stroke={i === 3 ? 'grey' : ''}
              className="horizon-arc"
            />
          </React.Fragment>
        ))}
      </g>
    );
  }
  return <></>;
};
