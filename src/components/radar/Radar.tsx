import React from 'react';

import { RADAR_DATA } from '../../constants/RadarData';
import csvData from '../../assets/techradar_dataset.csv';
import { CSVManager, getCSVFileFromUrl } from '../../services/CSVManager';

import './RadarSvg.scss';
import style from './Radar.module.scss';
import { RadarRenderUtils } from './utilities/RadarRenderUtils';

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
      RadarRenderUtils.setupFourQuadrants(radarRef.current, RADAR_DATA, radarData);
    }
  }, [radarRef, radarData]);

  return <div className={style.techradar} ref={radarRef} />;
};
