import React from 'react';

import { RadarContext } from '../RadarProvider';
import { Title } from '../components/shared/Title';
import { actions } from '../redux/radar/radar.actions';
import { DEFAULT_TITLE } from '../constants/RadarConstants';
import { RadarStateLabel } from '../redux/radar/radar.state';

import { RadarSVG } from './svg_comps/RadarSVG';
// SCSS
import './RadarSvg.scss';
import { BlipWithQuadrantKey } from '../types';

export const Radar: React.FC = () => {
  const {
    state: {
      [RadarStateLabel.STATE]: { blips, radarData },
    },
    dispatch,
  } = React.useContext(RadarContext);

  const setSelectedItem = (blip: BlipWithQuadrantKey | null) => dispatch(actions.setSelectedItem(blip));
  const setHoveredItem = (blip: BlipWithQuadrantKey | null) => dispatch(actions.setHoveredItem(blip));
  const setSelectedQuadrant = (quadrant: string | null) => dispatch(actions.setSelectedQuadrant(quadrant));

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
};
