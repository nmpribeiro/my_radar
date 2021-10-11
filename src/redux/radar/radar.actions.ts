import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RadarUtilities } from '../../radar/utilities/RadarUtilities';

import { CSVManager, getCSVFileFromUrl } from '../../services/CSVManager';
import { BlipWithQuadrantKey, QuadrantKey, RadarOptionsType } from '../../types';

import { ActionType, radarModule, RadarState } from './radar.state';

/**
 * Exportable Actions
 */
const setBlips = radarModule.setPayloadAction<BlipWithQuadrantKey[]>(ActionType.SET_BLIPS, (state, action) => ({
  ...state,
  blips: action.payload,
}));

const setRawBlips = radarModule.setPayloadAction<BlipWithQuadrantKey[]>(ActionType.SET_RAW_BLIPS, (state, action) => ({
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

const setSelectedItem = radarModule.setPayloadAction<BlipWithQuadrantKey | null>(
  ActionType.SET_SELECTED_ITEM,
  (state, action) => ({
    ...state,
    selectedItem: action.payload,
  })
);

const setHoveredItem = radarModule.setPayloadAction<BlipWithQuadrantKey | null>(ActionType.SET_HOVERED_ITEM, (state, action) => ({
  ...state,
  hoveredItem: action.payload,
}));

const setHoveredTech = radarModule.setPayloadAction<string | null>(ActionType.SET_HOVERED_TECH, (state, action) => ({
  ...state,
  hoveredTech: action.payload,
}));

const setSelectedQuadrant = radarModule.setPayloadAction<QuadrantKey | null>(
  ActionType.SET_SELECTED_QUADRANT,
  (state, action) => ({ ...state, selectedQuadrant: action.payload })
);

const reset = radarModule.setSimpleAction(ActionType.RESET, () => radarModule.initialState);

/**
 * Thunks
 */
type RadarThunks<R> = ThunkAction<R, RadarState, null, AnyAction>;

type FetchRadarDataThunk = (
  content: string,
  mappingLogic: (value: BlipWithQuadrantKey, index: number, array: BlipWithQuadrantKey[]) => BlipWithQuadrantKey
) => RadarThunks<void>;
const fetchRadarBlips: FetchRadarDataThunk = (content, mappingLogic) => async (dispatch) => {
  const radarCSV = await getCSVFileFromUrl(content);
  const rawBlips: BlipWithQuadrantKey[] = new CSVManager(radarCSV).processCSV() as unknown as BlipWithQuadrantKey[];
  const cleanedRawBlips = RadarUtilities.cleanRawBlips(rawBlips, mappingLogic);
  setRawBlips(cleanedRawBlips);
  dispatch(setRawBlips(cleanedRawBlips));
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
  setHoveredItem,
  setHoveredTech,
  setSelectedQuadrant,
  reset,
  // testAsync,
  fetchRadarBlips,
};

/**
 * Exportable Selectors
 */
export const selectors = (state: RadarState): RadarState => radarModule.helper(state);
