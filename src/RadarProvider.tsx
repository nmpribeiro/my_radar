import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AnyAction, CombinedState } from 'redux';

import { combinedRadarModuleReducers } from './redux/reducer';
import { defaultModuleState, ModuleRadarState } from './redux/state';

type RadarContextType = {
  state: CombinedState<ModuleRadarState>;
  dispatch: React.Dispatch<AnyAction>;
};

export const RadarContext = createContext<RadarContextType>({
  state: defaultModuleState,
  dispatch: () => {},
});

interface Props {
  subscriber?: (state: ModuleRadarState) => {};
}

export const RadarProvider: React.FC<Props> = ({ subscriber }) => {
  const [state, dispatch] = useReducer(combinedRadarModuleReducers, defaultModuleState);

  useEffect(() => {
    if (subscriber) subscriber(state);
  }, [state]);

  return <RadarContext.Provider value={{ state, dispatch }} />;
};

export const useRadarStore = () => useContext(RadarContext);
