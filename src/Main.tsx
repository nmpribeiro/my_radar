import React, { useEffect, useState } from 'react';

import { App } from './app/App';
import csvData from './assets/techradar_dataset.csv';
import { CSVManager, getCSVFileFromUrl } from './services/CSVManager';
import { RadarUtilities } from './radar/utilities/Utilities';
import { InitialRadarContextValue, RadarContext } from './services/RadarContext';

export const Main: React.FC = () => {
  const [contextValue, setContextValue] = useState(InitialRadarContextValue);

  const fetchRadarBlips = async (): Promise<RawBlipType[]> => {
    const radarCSV = await getCSVFileFromUrl(csvData);
    const csvManager = new CSVManager(radarCSV);
    return csvManager.processCSV<RawBlipType>();
  };

  // work out data
  const init = async () => {
    const blips = await fetchRadarBlips();
    setContextValue(RadarUtilities.getRadarData(blips));
  };

  // on mount
  useEffect(() => {
    init();
  }, []);

  return (
    <RadarContext.Provider value={contextValue}>
      <App />
    </RadarContext.Provider>
  );
};
