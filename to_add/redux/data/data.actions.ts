import { ModuleRadarState } from '../state';
import { ActionType, dataModule, DataState } from './data.state';

/**
 * Exportable Actions
 */
const setTitleKey = dataModule.setPayloadAction<string>(ActionType.SET_TITLE_KEY, (state, action) => ({
  ...state,
  titleKey: action.payload,
}));

const setHorizonKey = dataModule.setPayloadAction<string>(ActionType.SET_HORIZON_KEY, (state, action) => ({
  ...state,
  horizonKey: action.payload,
}));

const setQuadrantKey = dataModule.setPayloadAction<string>(ActionType.SET_QUADRANT_KEY, (state, action) => ({
  ...state,
  quadrantKey: action.payload,
}));

const setTechKey = dataModule.setPayloadAction<string>(ActionType.SET_TECH_KEY, (state, action) => ({
  ...state,
  techKey: action.payload,
}));

const reset = dataModule.setSimpleAction(ActionType.RESET, () => dataModule.initialState);

/**
 * Thunks
 */

/**
 * Actions
 */
export const actions = {
  setTitleKey,
  setHorizonKey,
  setQuadrantKey,
  setTechKey,
  reset,
};

/**
 * Exportable Selectors
 */
export const selectors = (state: ModuleRadarState): DataState => dataModule.helper(state);
