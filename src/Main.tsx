import React, { useEffect } from 'react';
import { Connect } from 'redux-auto-actions';
import { BrowserRouter } from 'react-router-dom';

import { App } from './app/App';
import { GlobalState } from './store/state';
// import csvData from './assets/techradar_dataset.csv';
import csvData2 from './assets/technology_radar_dataset_updated.csv';
import { actions } from './store/radar/radar.actions';
import { RadarDataGenerator } from './radar/RadarDataGenerator';

export const Main = Connect<GlobalState, Record<string, unknown>>()
  .stateAndDispatch(() => ({}), {
    fetchRadarBlips: actions.fetchRadarBlips,
  })
  .withComp(({ fetchRadarBlips }) => {
    // on mount
    useEffect(() => {
      // fetchRadarBlips(csvData);
      fetchRadarBlips(csvData2);
    }, []);

    return (
      <BrowserRouter>
        <RadarDataGenerator>
          <App />
        </RadarDataGenerator>
      </BrowserRouter>
    );
  });
