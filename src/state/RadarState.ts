import { RadarOptionsType, QuadrantKey } from '../types';

export type RadarStateType<RawBlipType = unknown, BlipType = unknown> = {
  radarData: RadarOptionsType;
  rawBlips: RawBlipType[]; // TODO: rename to unprocessed
  blips: BlipType[];
  isFiltered: boolean;
  useCaseFilter: string;
  disasterTypeFilter: string;
  techFilter: string | null;
  selectedItem: BlipType | null;
  hoveredItem: BlipType | null;
  hoveredTech: string | null;
  selectedQuadrant: QuadrantKey | null;
};

export const RadarInitialState: RadarStateType = {
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
};
