import { combineReducers } from 'redux';

import { GlobalState } from './state';
import { appS, AppStateLabel } from './app/app.state';
import { radarModule, RadarStateLabel } from './radar/radar.state';

export const combinedReducers = combineReducers<GlobalState>({
  [AppStateLabel.STATE]: appS.getReducer(),
  [RadarStateLabel.STATE]: radarModule.getReducer(),
});
