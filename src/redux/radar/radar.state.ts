import { StoreModule } from 'redux-auto-actions';
import { BlipWithQuadrantKey, QuadrantKey, RadarOptionsType } from '../../types';

export enum RadarStateLabel {
  STATE = 'radar',
}

export interface RadarState {
  radarData: RadarOptionsType;
  rawBlips: BlipWithQuadrantKey[]; // TODO: rename to unprocessed
  blips: BlipWithQuadrantKey[];
  isFiltered: boolean;
  useCaseFilter: string;
  disasterTypeFilter: string;
  techFilter: string | null;
  selectedItem: BlipWithQuadrantKey | null;
  hoveredItem: BlipWithQuadrantKey | null;
  hoveredTech: string | null;
  selectedQuadrant: QuadrantKey | null;
}

export const radarModule = new StoreModule<ActionType, RadarState>(RadarStateLabel.STATE, {
  radarData: {
    title: '',
    width: 0,
    height: 0,
    quadrants: [],
    horizons: [],
    radarOptions: {
      horizonShiftRadius: 0,
      radiusPadding: 0,
      circlePadding: 0,
    },
    tech: [],
  },
  rawBlips: [],
  blips: [],
  isFiltered: false,
  useCaseFilter: 'all',
  disasterTypeFilter: 'all',
  techFilter: null,
  selectedItem: null,
  hoveredItem: null,
  hoveredTech: null,
  selectedQuadrant: null,
});

export enum ActionType {
  SET_BLIPS = 'RADAR/SET_BLIPS',
  SET_RAW_BLIPS = 'RADAR/SET_RAW_BLIPS',
  SET_RADAR_DATA = 'RADAR/SET_RADAR_DATA',
  SET_IS_FILTER = 'RADAR/SET_IS_FILTER',
  SET_USE_CASE_FILTER = 'RADAR/SET_USE_CASE_FILTER',
  SET_DISASTER_TYPE_FILTER = 'RADAR/SET_DISASTER_TYPE_FILTER',
  SET_TECH_FILTER = 'RADAR/SET_TECH_FILTER',
  SET_SELECTED_ITEM = 'RADAR/SET_SELECTED_ITEM',
  SET_HOVERED_ITEM = 'RADAR/SET_HOVERED_ITEM',
  SET_HOVERED_TECH = 'RADAR/SET_HOVERED_TECH',
  SET_SELECTED_QUADRANT = 'RADAR/SET_SELECTED_QUADRANT',
  RESET = 'RADAR/RESET',
}
