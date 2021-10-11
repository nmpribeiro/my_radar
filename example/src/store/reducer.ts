import { combineReducers } from 'redux';

import { GlobalState } from './state';
import { appS, AppStateLabel } from './app/app.state';

export const combinedReducers = combineReducers<GlobalState>({
  [AppStateLabel.STATE]: appS.getReducer(),
});
