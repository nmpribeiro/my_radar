import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { GlobalState } from '../state';
import { CSVManager, getCSVFileFromUrl } from '../../services/CSVManager';

import { ActionType, radarModule } from './radar.state';

/**
 * Exportable Actions
 */
const setBlips = radarModule.setPayloadAction<BlipType[]>(
  ActionType.SET_BLIPS,
  (blips) => blips,
  (state, action) => ({ ...state, blips: action.payload })
).action;

const setRawBlips = radarModule.setPayloadAction<RawBlipType[]>(
  ActionType.SET_RAW_BLIPS,
  (blips) => blips,
  (state, action) => ({ ...state, rawBlips: action.payload })
).action;

const setRadarData = radarModule.setPayloadAction<RadarOptionsType>(
  ActionType.SET_RADAR_DATA,
  (data) => data,
  (state, action) => ({ ...state, radarData: action.payload })
).action;

const setIsFilter = radarModule.setPayloadAction<boolean>(
  ActionType.SET_IS_FILTER,
  (flag) => flag,
  (state, action) => ({ ...state, isFiltered: action.payload })
).action;

const setUseCaseFilter = radarModule.setPayloadAction<string>(
  ActionType.SET_USE_CASE_FILTER,
  (useCase) => useCase,
  (state, action) => ({ ...state, useCaseFilter: action.payload })
).action;

const setDisasterTypeFilter = radarModule.setPayloadAction<string>(
  ActionType.SET_DISASTER_TYPE_FILTER,
  (disasterType) => disasterType,
  (state, action) => ({ ...state, disasterTypeFilter: action.payload })
).action;

const reset = radarModule.setSimpleAction(ActionType.RESET, () => radarModule.initialState).action;

/**
 * Thunks
 */
type RadarThunks<R> = ThunkAction<R, GlobalState, null, AnyAction>;

type FetchRadarDataThunk = (content: string) => RadarThunks<void>;
const fetchRadarBlips: FetchRadarDataThunk = (content) => async (dispatch) => {
  const radarCSV = await getCSVFileFromUrl(content);
  const csvManager = new CSVManager(radarCSV);
  const rawBlips = csvManager.processCSV<RawBlipType>();
  setRawBlips(csvManager.processCSV<RawBlipType>());
  dispatch(setRawBlips(rawBlips));
  // RadarUtilities.getRadarData(rawBlips);
};

export const actions = {
  setBlips,
  setRawBlips,
  setRadarData,
  setIsFilter,
  setUseCaseFilter,
  setDisasterTypeFilter,
  reset,
  // testAsync,
  fetchRadarBlips,
};

/**
 * Reducer
 */
export const AppReducer = radarModule.getReducer();

/**
 * Exportable Selectors
 */
export const selectors = radarModule.helper;
