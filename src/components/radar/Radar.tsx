import React from 'react';

import { RADAR_DATA } from '../../constants/RadarData';
import csvData from '../../assets/techradar_dataset.csv';
import { CSVManager, getCSVFileFromUrl } from '../../services/CSVManager';

import './RadarSvg.scss';
import style from './Radar.module.scss';
import { RadarRenderUtils } from './utilities/RadarRenderUtils';
import { RadarUtilities } from './utilities/Utilities';

export const Radar: React.FC = () => {
  const radarRef = React.createRef<HTMLDivElement>();

  const [radarData, setRadarData] = React.useState<RawBlipType[]>([]);

  const getRadarData = async () => {
    const radarCSV = await getCSVFileFromUrl(csvData);
    const csvManager = new CSVManager(radarCSV);
    const dataType = csvManager.processCSV<RawBlipType>();
    setRadarData(dataType);
  };

  React.useEffect(() => {
    getRadarData();
  }, []);

  // On radar ref
  React.useEffect(() => {
    if (radarRef.current && radarData.length > 0) {
      // TODO: Setup RADAR_DATA adding quadrants and horizon, as they come from CSV radarData
      const newHorizons = RadarUtilities.getNewHorizons(radarData, 'Level of implementation');
      RADAR_DATA.horizons = newHorizons;
      const newQuadrants = RadarUtilities.getNewQuadrants(radarData);
      RADAR_DATA.quadrants = newQuadrants;
      RadarRenderUtils.setupFourQuadrants(radarRef.current, RADAR_DATA, radarData);
    }
  }, [radarRef, radarData]);

  return <div className={style.techradar} ref={radarRef} />;
};
