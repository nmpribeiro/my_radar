import { dataModule, DataState, DataStateLabel } from './data/data.state';
import { radarModule, RadarState, RadarStateLabel } from './radar/radar.state';

export interface ModuleRadarState {
  [DataStateLabel.STATE]: DataState;
  [RadarStateLabel.STATE]: RadarState;
}

export const defaultModuleState: ModuleRadarState = {
  [DataStateLabel.STATE]: dataModule.initialState,
  [RadarStateLabel.STATE]: radarModule.initialState,
};
