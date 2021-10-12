import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { RadarProvider } from 'undp-radar';
import { v4 } from 'uuid';

// import { App } from './app/App';
// import csvData from './assets/techradar_dataset.csv';
import csvData2 from './assets/technology_radar_dataset_updated.csv';
import { SuperRawBlipType } from './models/Item';

const cleanupStringArray = (arr: string[]): string[] => arr.map((t) => t.trim());

export const Main: React.FC = () => {
  const mappingLogic = (item: SuperRawBlipType) => ({
    'Country of Implementation': item['Country of Implementation'],
    Data: item.Data,
    'Date of Implementation': item['Date of Implementation'],
    Description: item.Description,
    'Disaster Cycle': item['Disaster Cycle'],
    'Ideas/Concepts/Examples': item['Ideas/Concepts/Examples'],
    Source: item.Source,
    'Status/Maturity': item['Status/Maturity'],
    'Supporting Partners': item['Supporting Partners'],
    'Un Host Organisation': item['Un Host Organisation'],
    'Use Case': item['Use Case'],
    SDG: cleanupStringArray((item.SDG as string).split(',')) as any,
    Technology: cleanupStringArray((item.Technology as string).split(',')) as any,
  });
  return (
    <BrowserRouter>
      {/* <App /> */}
      <RadarProvider csvFileUrl={csvData2} mappingLogic={mappingLogic}>
        <div>FOO</div>
      </RadarProvider>
    </BrowserRouter>
  );
};
