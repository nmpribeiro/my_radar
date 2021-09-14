import React from 'react';

import { RADAR_OPTIONS } from '../constants/RadarData';

export type RadarDataAndBLips = {
  data: RadarOptionsType;
  blips: BlipType[];
};

export type RadarContextType = RadarDataAndBLips & {
  setFilteredBlips: (newFilterDisasterType: string | null, newFilterUseCase: string | null) => void;
  filterUseCase: string | null;
  filterDisasterType: string | null;
};

export const InitialRadarContextValue: RadarContextType = {
  data: RADAR_OPTIONS,
  blips: [],
  setFilteredBlips: () => {},
  filterDisasterType: null,
  filterUseCase: null,
};

export const RadarContext = React.createContext(InitialRadarContextValue);
