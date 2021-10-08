import React, { useEffect, useState } from 'react';
import { Connect } from 'redux-auto-actions';

import { Title } from '../shared/Title';
import { GlobalState } from '../../store/state';
import { ScrollableDiv } from '../shared/ScrollableDiv';
import { RadarUtilities } from '../../radar/utilities/RadarUtilities';
import { TECH_KEY, USE_CASE_KEY } from '../../constants/RadarData';
import { actions, selectors } from '../../store/radar/radar.actions';

import { TechItem } from './TechItem';

export const TechList = Connect<GlobalState, unknown>()
  .stateAndDispatch(
    (state) => ({
      blips: selectors(state).blips,
      radarData: selectors(state).radarData,
      techFilter: selectors(state).techFilter,
      hoveredItem: selectors(state).hoveredItem,
      useCaseFilter: selectors(state).useCaseFilter,
      disasterTypeFilter: selectors(state).disasterTypeFilter,
    }),
    {
      setTechFilter: actions.setTechFilter,
      setHoveredTech: actions.setHoveredTech,
    }
  )
  .withComp(({ blips, radarData, techFilter, hoveredItem, useCaseFilter, disasterTypeFilter, setTechFilter, setHoveredTech }) => {
    const [tech, setTech] = useState<TechItemType[]>([]);

    const resetTech = () => setTechFilter(null);

    useEffect(() => {
      if (blips.length > 0) {
        const newTechMap: Map<string, TechItemType> = new Map();
        RadarUtilities.filterBlips(blips, useCaseFilter, disasterTypeFilter).forEach((b) => {
          (b[TECH_KEY] as string[]).forEach((techy) => {
            const foundTech = radarData.tech.find((t) => t.type === techy);

            if (foundTech && !newTechMap.has(foundTech.slug)) {
              // could be added
              if (b[USE_CASE_KEY] === useCaseFilter || useCaseFilter === 'all') {
                (b[TECH_KEY] as string[]).forEach((t) => {
                  if (t === foundTech.type) newTechMap.set(t, foundTech);
                });
              }
              if (b[USE_CASE_KEY] === disasterTypeFilter || disasterTypeFilter === 'all') {
                (b[TECH_KEY] as string[]).forEach((t) => {
                  if (t === foundTech.type) newTechMap.set(t, foundTech);
                });
              }
            }
          });
        });
        setTech(Array.from(newTechMap.values()));
      }
    }, [blips, radarData, useCaseFilter, disasterTypeFilter]);

    return (
      <div>
        <Title label="Technologies" />
        <ScrollableDiv>
          {tech.map((t) => (
            <TechItem
              key={t.uuid}
              setHoveredTech={setHoveredTech}
              hoveredItem={hoveredItem}
              tech={t}
              selected={t.slug === techFilter}
              setTechFilter={setTechFilter}
            />
          ))}
        </ScrollableDiv>
        <button onClick={resetTech} type="button" style={{ marginTop: 10 }}>
          Reset
        </button>
      </div>
    );
  });
