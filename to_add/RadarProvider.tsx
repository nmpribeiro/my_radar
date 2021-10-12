import { Provider, ReactReduxContextValue } from 'react-redux';
import React, { createContext, useContext } from 'react';

import { defaultModuleState, ModuleRadarState } from './redux/state';
import { moduleRadarStore } from './redux/store';

export const RadarContext = createContext<ReactReduxContextValue<ModuleRadarState>>({
  store: moduleRadarStore,
  storeState: defaultModuleState,
});

export const RadarProvider: React.FC = ({ children }) => {
  return (
    <Provider context={RadarContext} store={moduleRadarStore}>
      {children}
    </Provider>
  );
};

export const useRadarStore = () => useContext(RadarContext);
