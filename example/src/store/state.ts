import { appS, AppState, AppStateLabel } from './app/app.state';

export interface GlobalState {
  [AppStateLabel.STATE]: AppState;
}

export const defaultState: GlobalState = {
  [AppStateLabel.STATE]: appS.initialState,
};
