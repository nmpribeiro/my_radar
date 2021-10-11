import { combineReducers } from 'redux';

import { ModuleRadarState } from './state';
import { radarModule, RadarStateLabel } from './radar/radar.state';
import { dataModule, DataStateLabel } from './data/data.state';

export const combinedRadarModuleReducers = combineReducers<ModuleRadarState>({
  [DataStateLabel.STATE]: dataModule.getReducer(),
  [RadarStateLabel.STATE]: radarModule.getReducer(),
});
