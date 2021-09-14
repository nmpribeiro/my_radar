import React, { createRef, useEffect, useState } from 'react';
import { Connect } from 'redux-auto-actions';

import { GlobalState } from '../store/state';
import { Title } from '../components/shared/Title';
import { RADAR_OPTIONS } from '../constants/RadarData';
import { actions, selectors } from '../store/radar/radar.actions';

import './RadarSvg.scss';
import style from './Radar.module.scss';
import { RadarRenderUtils } from './utilities/RadarRenderUtils';
import { RadarUtilities } from './utilities/Utilities';

export const Radar = Connect<GlobalState, Record<string, unknown>>()
  .stateAndDispatch(
    (state) => ({
      radarData: selectors(state).radarData,
      blips: selectors(state).blips,
      rawBlips: selectors(state).rawBlips,
    }),
    {
      setBlips: actions.setBlips,
      setRadarData: actions.setRadarData,
    }
  )
  .withComp(({ radarData, setBlips, blips, setRadarData, rawBlips }) => {
    const radarRef = createRef<HTMLDivElement>();

    const [init, setInit] = useState(false);

    const setupRadar = () => {
      if (radarRef.current && blips) {
        RadarRenderUtils.setupFourQuadrants(radarRef.current, { blips, radarData });
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
    }, [init]);

    return (
      <>
        <Title label={radarData.title} />
        <div style={{ padding: 10 }}>
          <div className={style.techradar} ref={radarRef} />
        </div>
      </>
    );
  });
