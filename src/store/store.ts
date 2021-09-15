import { createStore, applyMiddleware, Store, Middleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import { defaultState } from './state';
import { combinedReducers } from './reducer';

const SHOW_REDUX_LOG = false;

const middleware: Middleware[] = [thunk];

if (process.env.NODE_ENV === 'development') {
  if (SHOW_REDUX_LOG) {
    const logger = createLogger({ collapsed: true, diff: false });
    if (logger) {
      middleware.push(logger);
    }
  }
}

export const appStore: Store = createStore(combinedReducers, defaultState, applyMiddleware(...middleware));

appStore.subscribe(() => {
  // you can do the following;
  // const state = appStore.getState() as GlobalState;
  // if (state.locale) LangUtils.updateLocale(locale);
});
