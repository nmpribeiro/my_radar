import { appS, AppState, AppStateLabel } from './app/app.state';
import { radarModule, RadarState, RadarStateLabel } from './radar/radar.state';

export interface GlobalState {
  [AppStateLabel.STATE]: AppState;
  [RadarStateLabel.STATE]: RadarState;
}

export const defaultState: GlobalState = {
  [AppStateLabel.STATE]: appS.initialState,
  [RadarStateLabel.STATE]: radarModule.initialState,
};
