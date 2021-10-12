import { createStore, applyMiddleware, Store, Middleware } from 'redux';
import thunk from 'redux-thunk';
// import * as logger from 'redux-logger';

import { defaultModuleState, ModuleRadarState } from './state';
import { combinedRadarModuleReducers } from './reducer';

// const SHOW_REDUX_LOG = false;

const middleware: Middleware[] = [thunk];

// if (process.env.NODE_ENV === 'development') {
//   if (SHOW_REDUX_LOG) {
//     const moduleLogger = logger.createLogger({ collapsed: true, diff: false });
//     if (moduleLogger) {
//       middleware.push(moduleLogger);
//     }
//   }
// }

export const moduleRadarStore: Store<ModuleRadarState> = createStore(
  combinedRadarModuleReducers,
  defaultModuleState,
  applyMiddleware(...middleware)
);

moduleRadarStore.subscribe(() => {
  // you can do the following;
  // const state = appStore.getState() as GlobalState;
  // if (state.locale) LangUtils.updateLocale(locale);
});
