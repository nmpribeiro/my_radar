import React, { useEffect, useState } from 'react';
import { Connect } from 'redux-auto-actions';
import { useParams } from 'react-router-dom';

import { Title } from '../shared/Title';
import { GlobalState } from '../../store/state';
import { selectors } from '../../store/radar/radar.actions';
import { RadarUtilities } from '../../radar/utilities/Utilities';
import { TECH_KEY, USE_CASE_KEY } from '../../constants/RadarData';

import { TechItem } from './TechItem';

type TParams = { technologySlug: string };

export const TechList = Connect<GlobalState, unknown>()
  .stateAndDispatch(
    (state) => ({
      blips: selectors(state).blips,
      radarData: selectors(state).radarData,
      useCaseFilter: selectors(state).useCaseFilter,
      disasterTypeFilter: selectors(state).disasterTypeFilter,
    }),
    {}
  )
  .withComp(({ blips, radarData, useCaseFilter, disasterTypeFilter }) => {
    const { technologySlug } = useParams<TParams>();

    const [tech, setTech] = useState<TechItemType[]>([]);

    useEffect(() => {
      if (blips.length > 0) {
        const newTechMap: Map<string, TechItemType> = new Map();
        RadarUtilities.filterBlips(blips, useCaseFilter, disasterTypeFilter).forEach((b) => {
          const foundTech = radarData.tech.find((t) => t.type === b[TECH_KEY]);
          if (!newTechMap.has(b[TECH_KEY]) && foundTech) {
            // could be added
            if (b[USE_CASE_KEY] === useCaseFilter || useCaseFilter === 'all') {
              newTechMap.set(b[TECH_KEY], foundTech);
            }
            if (b[USE_CASE_KEY] === disasterTypeFilter || disasterTypeFilter === 'all') {
              newTechMap.set(b[TECH_KEY], foundTech);
            }
          }
        });
        setTech(Array.from(newTechMap.values()));
      }
    }, [blips, useCaseFilter, disasterTypeFilter]);

    return (
      <div>
        <Title label="Technologies" />
        {tech.map((t) => (
          <TechItem key={t.uuid} tech={t} selected={t.slug === technologySlug} />
        ))}
      </div>
    );
  });
