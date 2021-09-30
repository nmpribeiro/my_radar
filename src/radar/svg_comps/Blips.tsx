import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Connect } from 'redux-auto-actions';

import { GlobalState } from '../../store/state';
import { actions, selectors } from '../../store/radar/radar.actions';
import { RadarUtilities } from '../utilities/Utilities';
import { DISASTER_TYPE_KEY, QUADRANT_KEY, TECH_KEY, TITLE_KEY, USE_CASE_KEY } from '../../constants/RadarData';

import './Blips.scss';

const RawBlip: React.FC<{
  blip: BlipType;
  scaleFactor?: number;
  hoveredItem: BlipType | null;
  fillLogic: (blip: BlipType) => string;
  setHoveredItem: (blip: BlipType | null) => void;
  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, d3.BaseType>;
}> = ({ blip, tooltip, fillLogic, scaleFactor = 1, hoveredItem, setHoveredItem }) => (
  <g
    key={blip.id}
    className="blip"
    id={`blip-${blip.id}`}
    transform={`translate(${blip.x * scaleFactor}, ${blip.y * scaleFactor})`}
    cursor="pointer"
    onMouseOver={(event) => {
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip
        .html(`<h4>${blip[TITLE_KEY]}</h4>`)
        .style('left', `${event.pageX + 15}px`)
        .style('top', `${event.pageY - 10}px`);
      event.currentTarget.setAttribute('opacity', '0.5');
    }}
    onMouseMove={(event) => tooltip.style('left', `${event.pageX + 15}px`).style('top', `${event.pageY - 10}px`)}
    onMouseOut={(event) => {
      setHoveredItem(null);
      tooltip.transition().duration(250).style('opacity', 0);
      event.currentTarget.setAttribute('opacity', '1');
    }}
    onMouseEnter={() => setHoveredItem(blip)}
  >
    <circle r={6} fill={fillLogic(blip)} />
    <circle
      className={hoveredItem?.id === blip.id ? 'circle-pulse1' : ''}
      r={8}
      strokeWidth={1.5}
      stroke={fillLogic(blip)}
      fill="none"
    />
    <circle
      className={hoveredItem?.id === blip.id ? 'circle-pulse2' : ''}
      r={11}
      strokeWidth={0.5}
      stroke={fillLogic(blip)}
      fill="transparent"
    />
  </g>
);

interface Props {
  quadrant?: QuadrantKey | null;
  scaleFactor?: number;
}

export const Blips = Connect<GlobalState, Props>()
  .stateAndDispatch(
    (state) => ({
      blips: selectors(state).blips,
      radarData: selectors(state).radarData,
      hoveredItem: selectors(state).hoveredItem,
      useCaseFilter: selectors(state).useCaseFilter,
      disasterTypeFilter: selectors(state).disasterTypeFilter,
      techFilter: selectors(state).techFilter,
    }),
    {
      setHoveredItem: actions.setHoveredItem,
    }
  )
  .withComp(
    ({
      blips,
      radarData,
      hoveredItem,
      useCaseFilter,
      disasterTypeFilter,
      techFilter,
      setHoveredItem,
      scaleFactor = 1,
      quadrant = null,
    }) => {
      const [displayBlips, setDisplayBlips] = useState<BlipType[]>([]);

      useEffect(() => {
        // process and sort the blips
        let filtered = blips.sort(RadarUtilities.blipsSorting);
        if (quadrant) {
          filtered = filtered.filter((b) => b[QUADRANT_KEY] === quadrant);
        } else {
          if (useCaseFilter !== 'all') filtered = filtered.filter((i) => i[USE_CASE_KEY] === useCaseFilter);
          if (disasterTypeFilter !== 'all') filtered = filtered.filter((i) => i[DISASTER_TYPE_KEY] === disasterTypeFilter);
          const tech = radarData.tech.find((t) => t.slug === techFilter);
          if (techFilter && tech) filtered = filtered.filter((i) => i[TECH_KEY] === tech.type);
        }

        setDisplayBlips(filtered);
      }, [blips, useCaseFilter, disasterTypeFilter, techFilter]);

      const fillLogic = (blip: BlipType) => {
        const tech = radarData.tech.find((t) => t.type === blip[TECH_KEY]);
        if (tech) return tech.color;
        return '';
      };

      // Add a div
      const RADAR_TOOLTIP_ID = 'radar-tooltip';
      let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, d3.BaseType> = d3.select(`#${RADAR_TOOLTIP_ID}`);
      if (tooltip.empty()) {
        tooltip = d3.select('body').append('div').attr('id', RADAR_TOOLTIP_ID).style('opacity', 0);
      }

      return (
        <>
          {displayBlips.map((blip) => (
            <RawBlip
              blip={blip}
              scaleFactor={scaleFactor}
              tooltip={tooltip}
              fillLogic={fillLogic}
              setHoveredItem={setHoveredItem}
              hoveredItem={hoveredItem}
            />
          ))}
        </>
      );
    }
  );
