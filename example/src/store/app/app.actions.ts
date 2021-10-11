import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { GlobalState } from '../state';

import { ActionType, appS } from './app.state';

/**
 * Exportable Actions
 */
const increment = appS.setPayloadAction<number>(ActionType.INCREMENT, (state, action) => ({
  ...state,
  counter: state.counter + action.payload,
}));
const decrement = appS.setPayloadAction<number>(ActionType.DECREMENT, (state, action) => ({
  ...state,
  counter: state.counter - action.payload,
}));
const reset = appS.setSimpleAction(ActionType.RESET, () => appS.initialState);

/**
 * Thunks
 */
type AppThunks<R> = ThunkAction<R, GlobalState, null, AnyAction>;

type TestAyncThunk = (amount: number) => AppThunks<boolean>;
const testAsync: TestAyncThunk = (amount) => (dispatch) => {
  setTimeout(() => dispatch(increment(amount)), 1000);
  return true;
};

export const actions = {
  increment,
  decrement,
  reset,
  testAsync,
};

/**
 * Reducer
 */
export const AppReducer = appS.getReducer();

/**
 * Exportable Selectors
 */
export const selectors = appS.helper;
