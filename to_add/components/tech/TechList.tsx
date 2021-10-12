import React, { useEffect, useState } from 'react';
import { Connect } from 'redux-auto-actions';

import { Title } from '../shared/Title';

import { TechItemType } from '../../types';
import { ModuleRadarState } from '../../redux/state';
import { ScrollableDiv } from '../shared/ScrollableDiv';
import { actions, selectors } from '../../redux/radar/radar.actions';
import { selectors as dataSelectors } from '../../redux/data/data.actions';
import { RadarUtilities } from '../../radar/utilities/RadarUtilities';
import { TECH_KEY, USE_CASE_KEY } from '../../constants/RadarConstants';

import { TechItem } from './TechItem';
import styles from './TechList.module.scss';

export const TechList: React.FC = Connect<ModuleRadarState>()
  .stateAndDispatch(
    (state) => ({
      blips: selectors(state).blips,
      useCaseFilter: selectors(state).useCaseFilter,
      disasterTypeFilter: selectors(state).disasterTypeFilter,
      radarData: selectors(state).radarData,
      hoveredTech: selectors(state).hoveredTech,
      hoveredItem: selectors(state).hoveredItem,
      techFilter: selectors(state).techFilter,
      techKey: dataSelectors(state).techKey,
    }),
    {
      setHoveredTech: actions.setHoveredTech,
      setTechFilter: actions.setTechFilter,
    }
  )
  .withComp(
    ({
      blips,
      useCaseFilter,
      disasterTypeFilter,
      radarData,
      hoveredTech,
      hoveredItem,
      techFilter,
      techKey,
      setHoveredTech,
      setTechFilter,
    }) => {
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
        <div style={{ textAlign: 'end' }}>
          <Title label="Technologies" />
          <ScrollableDiv>
            {tech.map((t) => (
              <TechItem
                key={t.uuid}
                hoveredTech={hoveredTech}
                setHoveredTech={setHoveredTech}
                hoveredItem={hoveredItem}
                tech={t}
                techKey={techKey}
                selected={t.slug === techFilter}
                setTechFilter={setTechFilter}
              />
            ))}
          </ScrollableDiv>
          <button onClick={resetTech} type="button" className={styles.resetTechButton}>
            Reset
          </button>
        </div>
      );
    }
  );
