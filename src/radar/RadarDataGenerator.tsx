import React, { useEffect } from 'react';
import { Connect } from 'redux-auto-actions';

import { GlobalState } from '../store/state';
import { RADAR_OPTIONS } from '../constants/RadarData';
import { selectors, actions } from '../store/radar/radar.actions';

import { RadarUtilities } from './utilities/RadarUtilities';

export const RadarDataGenerator = Connect<GlobalState>()
  .stateAndDispatch(
    (state) => ({
      rawBlips: selectors(state).rawBlips,
      radarData: selectors(state).radarData,
    }),
    { setBlips: actions.setBlips, setRadarData: actions.setRadarData }
  )
  .withComp(({ children, rawBlips, radarData, setBlips, setRadarData }) => {
    useEffect(() => {
      if (rawBlips.length > 0 && radarData) {
        const { radarData: newRadarData, blips: newBlips } = RadarUtilities.getRadarData(rawBlips, { ...RADAR_OPTIONS });
        setBlips(newBlips);
        setRadarData({ ...newRadarData });
      }
    }, [rawBlips]);
    return <>{children}</>;
  });
