import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { GlobalState } from '../state';
import { CSVManager, getCSVFileFromUrl } from '../../services/CSVManager';

import { ActionType, radarModule, RadarState } from './radar.state';

/**
 * Exportable Actions
 */
const setBlips = radarModule.setPayloadAction<BlipType[]>(ActionType.SET_BLIPS, (state, action) => ({
  ...state,
  blips: action.payload,
}));

const setRawBlips = radarModule.setPayloadAction<RawBlipType[]>(ActionType.SET_RAW_BLIPS, (state, action) => ({
  ...state,
  rawBlips: action.payload,
}));

const setRadarData = radarModule.setPayloadAction<RadarOptionsType>(ActionType.SET_RADAR_DATA, (state, action) => ({
  ...state,
  radarData: action.payload,
}));

const setIsFilter = radarModule.setPayloadAction<boolean>(ActionType.SET_IS_FILTER, (state, action) => ({
  ...state,
  isFiltered: action.payload,
}));

const setUseCaseFilter = radarModule.setPayloadAction<string>(ActionType.SET_USE_CASE_FILTER, (state, action) => ({
  ...state,
  useCaseFilter: action.payload,
}));

const setDisasterTypeFilter = radarModule.setPayloadAction<string>(ActionType.SET_DISASTER_TYPE_FILTER, (state, action) => ({
  ...state,
  disasterTypeFilter: action.payload,
}));

const setTechFilter = radarModule.setPayloadAction<string | null>(ActionType.SET_TECH_FILTER, (state, action) => ({
  ...state,
  techFilter: action.payload,
}));

const setSelectedItem = radarModule.setPayloadAction<BlipType | null>(ActionType.SET_SELECTED_ITEM, (state, action) => ({
  ...state,
  selectedItem: action.payload,
}));

const reset = radarModule.setSimpleAction(ActionType.RESET, () => radarModule.initialState);

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
};

export const actions = {
  setBlips,
  setRawBlips,
  setRadarData,
  setIsFilter,
  setUseCaseFilter,
  setDisasterTypeFilter,
  setTechFilter,
  setSelectedItem,
  reset,
  // testAsync,
  fetchRadarBlips,
};

/**
 * Exportable Selectors
 */
export const selectors = (state: GlobalState): RadarState => radarModule.helper(state);
