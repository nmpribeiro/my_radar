import React, { createRef, useEffect, useState } from 'react';
import { Connect } from 'redux-auto-actions';

import { GlobalState } from '../store/state';
import { Title } from '../components/shared/Title';
import { DISASTER_TYPE_KEY, RADAR_OPTIONS, TECH_KEY, USE_CASE_KEY } from '../constants/RadarData';
import { actions, selectors } from '../store/radar/radar.actions';

import './RadarSvg.scss';
import style from './Radar.module.scss';
import { RadarRenderUtils } from './utilities/RadarRenderUtils';
import { RadarUtilities } from './utilities/Utilities';

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
      setSelectedItem: actions.setSelectedItem,
    }
  )
  .withComp(({ radarData, setBlips, blips, setRadarData, rawBlips, useCaseFilter, disasterTypeFilter, techFilter }) => {
    const radarRef = createRef<HTMLDivElement>();

    const [init, setInit] = useState(false);
    const [title, setTitle] = useState(radarData.title);

    const setupRadar = () => {
      if (radarRef.current && blips) {
        radarRef.current.innerHTML = '';
        let filtered = blips;
        if (useCaseFilter !== 'all') filtered = filtered.filter((i) => i[USE_CASE_KEY] === useCaseFilter);
        if (disasterTypeFilter !== 'all') filtered = filtered.filter((i) => i[DISASTER_TYPE_KEY] === disasterTypeFilter);

        const tech = radarData.tech.find((t) => t.slug === techFilter);
        if (techFilter && tech) {
          filtered = filtered.filter((i) => i[TECH_KEY] === tech.type);
          setTitle(tech.type);
        } else {
          setTitle(radarData.title);
        }

        RadarRenderUtils.setupFourQuadrants(radarRef.current, { blips: filtered, radarData });
      }
    };

    useEffect(() => {
      if (rawBlips.length > 0 && radarData) {
        const newRadarData = { ...RADAR_OPTIONS };
        if (radarRef.current) {
          newRadarData.height = radarRef.current.clientHeight;
          newRadarData.width = radarRef.current.clientWidth;
        }
        const { radarData: newRadarData2, blips: newBlips } = RadarUtilities.getRadarData(rawBlips, newRadarData);
        setBlips(newBlips);
        setRadarData({ ...newRadarData2 });
        setTimeout(() => {
          setInit(true);
        }, 0);
      }
    }, [rawBlips]);

    useEffect(() => {
      if (init) setupRadar();
    }, [init, useCaseFilter, disasterTypeFilter, techFilter]);

    return (
      <>
        <Title label={title} />
        <div style={{ padding: 10 }}>
          <div className={style.techradar} ref={radarRef} />
        </div>
      </>
    );
  });
