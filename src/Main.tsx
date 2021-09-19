import React, { useEffect } from 'react';
import { Connect } from 'redux-auto-actions';
import { BrowserRouter } from 'react-router-dom';

import { App } from './app/App';
import { GlobalState } from './store/state';
import csvData from './assets/techradar_dataset.csv';
import { actions } from './store/radar/radar.actions';

export const MyMain = Connect<GlobalState, Record<string, unknown>>()
  .stateAndDispatch(() => ({}), {
    fetchRadarBlips: actions.fetchRadarBlips,
  })
  .withComp(({ fetchRadarBlips }) => {
    // on mount
    useEffect(() => {
      fetchRadarBlips(csvData);
    }, []);

    return <App />;
  });

export const Main: React.FC = () => (
  <BrowserRouter>
    <MyMain />
  </BrowserRouter>
);
