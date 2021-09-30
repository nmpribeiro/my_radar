import React, { useEffect, useState } from 'react';
import { Connect } from 'redux-auto-actions';

import { GlobalState } from '../store/state';
import { Title } from '../components/shared/Title';
import { DEFAULT_TITLE, DISASTER_TYPE_KEY, RADAR_OPTIONS, TECH_KEY, USE_CASE_KEY } from '../constants/RadarData';
import { actions, selectors } from '../store/radar/radar.actions';

import { RadarSVG } from './RadarSVG';
import { RadarUtilities } from './utilities/Utilities';
// SCSS
import './RadarSvg.scss';

export const Radar = Connect<GlobalState, unknown>()
  .stateAndDispatch(
    (state) => ({
      radarData: selectors(state).radarData,
      blips: selectors(state).blips,
      rawBlips: selectors(state).rawBlips,
      useCaseFilter: selectors(state).useCaseFilter,
      disasterTypeFilter: selectors(state).disasterTypeFilter,
      techFilter: selectors(state).techFilter,
    }),
    {
      setBlips: actions.setBlips,
      setRadarData: actions.setRadarData,
      setHoveredItem: actions.setHoveredItem,
      setSelectedItem: actions.setSelectedItem,
      setSelectedQuadrant: actions.setSelectedQuadrant,
    }
  )
  .withComp(
    ({
      radarData,
      setBlips,
      blips,
      setRadarData,
      rawBlips,
      useCaseFilter,
      disasterTypeFilter,
      techFilter,
      setSelectedItem,
      setHoveredItem,
      setSelectedQuadrant,
    }) => {
      const [init, setInit] = useState(false);
      const [title, setTitle] = useState(DEFAULT_TITLE);
      const [displayBlips, setDisplayBlips] = useState<BlipType[]>([]);

      useEffect(() => {
        if (rawBlips.length > 0 && radarData) {
          const { radarData: newRadarData, blips: newBlips } = RadarUtilities.getRadarData(rawBlips, { ...RADAR_OPTIONS });
          setBlips(newBlips);
          setRadarData({ ...newRadarData });
          setTimeout(() => {
            setInit(true);
          }, 0);
        }
      }, [rawBlips]);

      useEffect(() => {
        if (init && blips) {
          let filtered = blips;
          if (useCaseFilter !== 'all') filtered = filtered.filter((i) => i[USE_CASE_KEY] === useCaseFilter);
          if (disasterTypeFilter !== 'all') filtered = filtered.filter((i) => i[DISASTER_TYPE_KEY] === disasterTypeFilter);

          const tech = radarData.tech.find((t) => t.slug === techFilter);
          if (techFilter && tech) {
            filtered = filtered.filter((i) => i[TECH_KEY] === tech.type);
            setTitle(tech.type);
          } else {
            setTitle(DEFAULT_TITLE);
          }
          setDisplayBlips(filtered);
        }
      }, [init, useCaseFilter, disasterTypeFilter, techFilter, radarData]);

      return (
        <>
          <Title label={title} />
          <div style={{ padding: 10 }}>
            <RadarSVG
              minHeight={600}
              context={{ radarData, blips: displayBlips, logic: { setSelectedItem, setHoveredItem, setSelectedQuadrant } }}
            />
          </div>
        </>
      );
    }
  );
