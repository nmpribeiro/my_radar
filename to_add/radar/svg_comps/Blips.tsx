import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { v4 } from 'uuid';
import { Connect } from 'redux-auto-actions';

import { ModuleRadarState } from '../../redux/state';
import { actions } from '../../redux/radar/radar.actions';
import { RadarUtilities } from '../utilities/RadarUtilities';
import { selectors as dataSelectors } from '../../redux/data/data.actions';
import { selectors as radarSelectors } from '../../redux/radar/radar.actions';
import { QuadrantKey, TechItemType, BlipWithQuadrantKey } from '../../types';
import { DISASTER_TYPE_KEY, QUADRANT_KEY, TECH_KEY, TITLE_KEY, USE_CASE_KEY } from '../../constants/RadarConstants';

import './Blips.scss';

const RawBlip: React.FC<{
  blip: BlipWithQuadrantKey;
  blipSize?: number;
  scaleFactor?: number;
  hoveredItem: BlipWithQuadrantKey | null;
  selectedItem: BlipWithQuadrantKey | null;
  getFill: (blip: BlipWithQuadrantKey, index: number) => string;
  setHoveredItem: (blip: BlipWithQuadrantKey | null) => void;
  setSelectedItem: (blip: BlipWithQuadrantKey | null) => void;
  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, d3.BaseType>;
}> = ({ blip, blipSize = 1, scaleFactor = 1, hoveredItem, selectedItem, getFill, setHoveredItem, setSelectedItem, tooltip }) => {
  const openToolTip = () => {
    tooltip.attr('display', 'initial');
    tooltip.transition().duration(200).style('opacity', 0.9);
  };
  const closeTooltip = () => {
    setHoveredItem(null);
    tooltip
      .transition()
      .duration(250)
      .style('opacity', 0)
      .end()
      .then(() => tooltip.attr('display', 'none'))
      .catch(() => {}); // no need to act
  };
  return (
    <g
      key={blip.id}
      className="blip"
      id={`blip-${blip.id}`}
      transform={`translate(${blip.x * scaleFactor}, ${blip.y * scaleFactor})`}
      cursor="pointer"
      onMouseOver={(event) => {
        openToolTip();
        tooltip
          .html(`<h4>${blip[TITLE_KEY]}</h4>`)
          .style('left', `${event.pageX + 15}px`)
          .style('top', `${event.pageY - 10}px`);
        event.currentTarget.setAttribute('opacity', '0.5');
      }}
      onMouseMove={(event) => tooltip.style('left', `${event.pageX + 15}px`).style('top', `${event.pageY - 10}px`)}
      onMouseOut={(event) => {
        closeTooltip();
        event.currentTarget.setAttribute('opacity', '1');
      }}
      onMouseEnter={() => setHoveredItem(blip)}
      onMouseUp={() => {
        if (selectedItem && selectedItem.id === blip.id) setSelectedItem(null);
        else setSelectedItem(blip);
        closeTooltip();
      }}
    >
      <circle className="circle" r={6 * blipSize} fill={getFill(blip, 0)} />
      {/* https://codepen.io/riccardoscalco/pen/GZzZRz */}
      <circle
        className={`circle ${hoveredItem?.id === blip.id ? 'circle-pulse1' : ''}`}
        r={8 * blipSize}
        strokeWidth={1.5 * blipSize}
        stroke={getFill(blip, 1)}
        fill="none"
      />
      <circle
        className={`circle ${hoveredItem?.id === blip.id ? 'circle-pulse2' : ''}`}
        r={11 * blipSize}
        strokeWidth={0.5 * blipSize}
        stroke={getFill(blip, 2)}
        fill="transparent"
      />
    </g>
  );
};

interface Props {
  quadrant?: QuadrantKey | null;
  scaleFactor?: number;
  blipSize?: number;
}

export const Blips = Connect<ModuleRadarState, Props>()
  .stateAndDispatch(
    (state) => ({
      blips: radarSelectors(state).blips,
      useCaseFilter: radarSelectors(state).useCaseFilter,
      disasterTypeFilter: radarSelectors(state).disasterTypeFilter,
      radarData: radarSelectors(state).radarData,
      hoveredTech: radarSelectors(state).hoveredTech,
      hoveredItem: radarSelectors(state).hoveredItem,
      techFilter: radarSelectors(state).techFilter,
      selectedItem: radarSelectors(state).selectedItem,
      techKey: dataSelectors(state).techKey,
    }),
    {
      setHoveredItem: actions.setHoveredItem,
      setSelectedItem: actions.setSelectedItem,
    }
  )
  .withComp(
    ({
      scaleFactor = 1,
      blipSize = 1,
      quadrant = null,
      blips,
      useCaseFilter,
      disasterTypeFilter,
      radarData,
      techFilter,
      techKey,
      selectedItem,
      hoveredItem,
      hoveredTech,
      setHoveredItem,
      setSelectedItem,
    }) => {
      const [displayBlips, setDisplayBlips] = useState<BlipWithQuadrantKey[]>([]);

      useEffect(() => {
        // process and sort the blips
        let filtered = blips.sort(RadarUtilities.blipsSorting);
        if (quadrant) {
          filtered = filtered.filter((b) => b[QUADRANT_KEY] === quadrant);
        } else {
          if (useCaseFilter !== 'all') filtered = filtered.filter((i) => i[USE_CASE_KEY] === useCaseFilter);
          if (disasterTypeFilter !== 'all') filtered = filtered.filter((i) => i[DISASTER_TYPE_KEY] === disasterTypeFilter);

          const tech = radarData.tech.find((t) => t.slug === techFilter);
          if (techFilter && tech)
            filtered = filtered.filter((i) => {
              const itemTechs = i[techKey] as string[];
              return itemTechs.includes(tech.type);
            });
        }

        setDisplayBlips(filtered);
      }, [blips, useCaseFilter, disasterTypeFilter, techFilter]);

      const fillLogic = (blip: BlipWithQuadrantKey): TechItemType[] => {
        const allItemTechs: TechItemType[] = [];
        radarData.tech.forEach((radarTech) => {
          const itemTechs = blip[TECH_KEY] as string[];
          if (itemTechs.includes(radarTech.type)) allItemTechs.push(radarTech);
        });

        if (selectedItem !== null) {
          if (selectedItem.id === blip.id && allItemTechs.length > 0) return allItemTechs;
          return [{ color: 'rgba(100,100,100,.5)', uuid: v4(), type: '', slug: '', description: [''] }];
        }

        if (hoveredItem && hoveredItem.id !== blip.id) {
          return [{ color: 'rgba(100,100,100,.5)', uuid: v4(), type: '', slug: '', description: [''] }];
        }

        if ((!hoveredItem && techFilter !== 'all') || hoveredItem?.id === blip.id) {
          if (allItemTechs.length > 0) {
            const itemHoveredTech = allItemTechs.find((techItem) => hoveredTech === techItem.slug);
            if (hoveredTech === null) return allItemTechs;

            if (itemHoveredTech) {
              return [itemHoveredTech, ...allItemTechs.splice(allItemTechs.indexOf(itemHoveredTech), 1)];
            }
          }
        }

        // if (allItemTechs.length > 0) return allItemTechs;
        return [{ color: 'rgba(100,100,100,.5)', uuid: v4(), type: '', slug: '', description: [''] }];
      };

      const getFill = (blip: BlipWithQuadrantKey, index: number) => {
        const fillings = fillLogic(blip);
        if (fillings[index]) return fillings[index].color;
        return fillings[0].color;
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
              key={`${blip[TITLE_KEY]}-${blip.id}`}
              blip={blip}
              blipSize={blipSize}
              tooltip={tooltip}
              getFill={getFill}
              scaleFactor={scaleFactor}
              selectedItem={selectedItem}
              hoveredItem={hoveredItem}
              setHoveredItem={setHoveredItem}
              setSelectedItem={setSelectedItem}
            />
          ))}
        </>
      );
    }
  );
