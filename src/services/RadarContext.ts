import React from 'react';

import { RADAR_OPTIONS } from '../constants/RadarData';

export type RadarContextType = {
  data: RadarOptionsType;
  blips: RawBlipType[];
};

export const InitialRadarContextValue: RadarContextType = {
  data: RADAR_OPTIONS,
  blips: [],
};

export const RadarContext = React.createContext(InitialRadarContextValue);
