import React, { useState, useEffect } from 'react';

import { RadarUtilities } from './radar/utilities/RadarUtilities';
import { ActionsInitialState, ActionsType } from './state/Actions';
import { DataInitialState, DataStateType } from './state/DataState';
import { RadarInitialState, RadarStateType } from './state/RadarState';
import { CSVManager, getCSVFileFromUrl } from './services/CSVManager';
import { BaseCSVType, MappingLogicType } from './types';

export type RadarContextType = {
  data: DataStateType;
  radar: RadarStateType;
  actions: ActionsType;
};

const RadarContextInitialValue: RadarContextType = {
  data: DataInitialState,
  radar: RadarInitialState,
  actions: ActionsInitialState,
};

export const RadarContext = React.createContext<RadarContextType>(RadarContextInitialValue);

interface Props {
  csvFileUrl: string;
  mappingLogic: MappingLogicType;
}

export const RadarProvider: React.FC<Props> = ({ children, csvFileUrl, mappingLogic }) => {
  const [value, setValue] = useState(RadarContextInitialValue);

  const actions: ActionsType = {
    setRawBlips: (rawBlips) => setValue({ ...value, radar: { ...value.radar, rawBlips } }),
    setBlips: (blips) => setValue({ ...value, radar: { ...value.radar, blips } }),
  };

  const processCSV = async () => {
    const radarCSV = await getCSVFileFromUrl(csvFileUrl);
    const rawBlips: BaseCSVType[] = new CSVManager(radarCSV).processCSV();
    const cleanedRawBlips = RadarUtilities.cleanRawBlips(rawBlips, mappingLogic);
    actions.setRawBlips(cleanedRawBlips);
  };
  useEffect(() => {
    processCSV();
  }, [csvFileUrl]);

  return <RadarContext.Provider value={{ ...value, actions }}>{children}</RadarContext.Provider>;
};
