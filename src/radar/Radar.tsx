import React, { useEffect } from 'react';
import { Connect } from 'redux-auto-actions';

import { GlobalState } from '../store/state';
import { Title } from '../components/shared/Title';
import { DEFAULT_TITLE, RADAR_OPTIONS } from '../constants/RadarData';
import { actions, selectors } from '../store/radar/radar.actions';

import { RadarSVG } from './svg_comps/RadarSVG';
import { RadarUtilities } from './utilities/Utilities';
// SCSS
import './RadarSvg.scss';

export const Radar = Connect<GlobalState, unknown>()
  .stateAndDispatch(
    (state) => ({
      radarData: selectors(state).radarData,
      blips: selectors(state).blips,
      rawBlips: selectors(state).rawBlips,
    }),
    {
      setBlips: actions.setBlips,
      setRadarData: actions.setRadarData,
      setHoveredItem: actions.setHoveredItem,
      setSelectedItem: actions.setSelectedItem,
      setSelectedQuadrant: actions.setSelectedQuadrant,
    }
  )
  .withComp(({ radarData, setBlips, blips, setRadarData, rawBlips, setSelectedItem, setHoveredItem, setSelectedQuadrant }) => {
    useEffect(() => {
      if (rawBlips.length > 0 && radarData) {
        const { radarData: newRadarData, blips: newBlips } = RadarUtilities.getRadarData(rawBlips, { ...RADAR_OPTIONS });
        setBlips(newBlips);
        setRadarData({ ...newRadarData });
      }
    }, [rawBlips]);

    return (
      <>
        <Title label={DEFAULT_TITLE} />
        <div style={{ padding: 10 }}>
          <RadarSVG
            dimensions={{ w: 600, h: 600 }}
            context={{ radarData, blips, logic: { setSelectedItem, setHoveredItem, setSelectedQuadrant } }}
          />
        </div>
      </>
    );
  });
