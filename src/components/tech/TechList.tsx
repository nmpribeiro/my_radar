import React from 'react';
import { Connect } from 'redux-auto-actions';

import { Title } from '../shared/Title';
import { GlobalState } from '../../store/state';
import { selectors } from '../../store/radar/radar.actions';

import { TechItem } from './TechItem';

export const TechList = Connect<GlobalState, Record<string, unknown>>()
  .stateAndDispatch(
    (state) => ({
      radarData: selectors(state).radarData,
    }),
    {}
  )
  .withComp(({ radarData }) => (
    <div>
      <Title label="Technologies" />
      {/* TODO: tech list! {children} */}
      {radarData.tech.map((tech) => (
        <TechItem key={tech.uuid} tech={tech} />
      ))}
    </div>
  ));
