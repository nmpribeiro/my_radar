import React from 'react';
import { Connect } from 'redux-auto-actions';

import { GlobalState } from '../store/state';
import { Title } from '../components/shared/Title';
import { DEFAULT_TITLE } from '../constants/RadarData';
import { actions, selectors } from '../store/radar/radar.actions';

import { RadarSVG } from './svg_comps/RadarSVG';
// SCSS
import './RadarSvg.scss';

export const Radar = Connect<GlobalState, unknown>()
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
  .withComp(({ blips, radarData, setSelectedItem, setHoveredItem, setSelectedQuadrant }) => {
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
