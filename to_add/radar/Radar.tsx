import React from 'react';

import { ModuleRadarState } from '../redux/state';
import { Title } from '../components/shared/Title';
import { actions, selectors } from '../redux/radar/radar.actions';
import { DEFAULT_TITLE } from '../constants/RadarConstants';

import { RadarSVG } from './svg_comps/RadarSVG';
// SCSS
import './RadarSvg.scss';
import { Connect } from 'redux-auto-actions';

export const Radar = Connect<ModuleRadarState>()
  .stateAndDispatch(
    (state) => ({
      blips: selectors(state).blips,
      radarData: selectors(state).radarData,
    }),
    {
      setHoveredItem: actions.setHoveredItem,
      setSelectedItem: actions.setSelectedItem,
      setSelectedQuadrant: actions.setSelectedQuadrant,
    }
  )
  .withComp(({ blips, radarData, setHoveredItem, setSelectedItem, setSelectedQuadrant }) => (
    <>
      <Title label={DEFAULT_TITLE} />
      <div style={{ padding: 10 }}>
        <RadarSVG
          dimensions={{ w: 600, h: 600 }}
          context={{ radarData, blips, logic: { setSelectedItem, setHoveredItem, setSelectedQuadrant } }}
        />
      </div>
    </>
  ));
