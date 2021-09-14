import { v4 as uuidv4 } from 'uuid';

import { DISASTER_TYPE_KEY, HORIZONS_KEY, QUADRANT_KEY, RADAR_OPTIONS, TECH_KEY, USE_CASE_KEY } from '../../constants/RadarData';
import { RadarDataAndBLips } from '../../services/RadarContext';

/* eslint-disable no-plusplus */
const blipsSorting = (a: BlipType, b: BlipType): number => {
  if (a.quadrantIndex < b.quadrantIndex) return -1;
  if (a.quadrantIndex > b.quadrantIndex) return 1;
  return 0;
};

const randomFromInterval = (min: number, max: number): number => Math.random() * (max - min) + min;

const processBlips = (data: RadarOptionsType, rawBlips: RawBlipType[]): BlipType[] => {
  // go through the data
  const results: BlipType[] = [];

  const width = data.width || 800;
  const height = data.height || 600;
  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;
  const horizonUnit = (horizonWidth - data.horizonShiftRadius) / data.horizons.length;

  rawBlips.forEach((blip) => {
    // TODO: get them a bit more appart
    // for instance: (quantize the area and assign to each square)

    // get angle
    const quadrantIndex = data.quadrants.indexOf(blip[QUADRANT_KEY]) - 1;
    const angle = randomFromInterval(quadrantIndex * (Math.PI / 2), quadrantIndex * (Math.PI / 2) + Math.PI / 2);

    // get radius
    const horizonIndex = data.horizons.indexOf(blip[HORIZONS_KEY]) + 1;
    const outerRadius = horizonIndex * horizonUnit - horizonUnit / 2 + data.horizonShiftRadius;
    const innerRadius = horizonIndex * horizonUnit + data.horizonShiftRadius;
    const radius = randomFromInterval(innerRadius, outerRadius);

    results.push({
      ...blip,
      id: uuidv4(),
      quadrantIndex,
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    });
  });

  return results;
};

const getHorizons = (rawBlipData: BlipType[]): string[] => {
  const newHorizons: string[] = [];
  rawBlipData.forEach((val) => {
    if (!newHorizons.includes(val[HORIZONS_KEY])) newHorizons.push(val[HORIZONS_KEY]);
  });
  return newHorizons;
};

const getQuadrants = (rawBlipData: BlipType[]): string[] => {
  const newQuadrants: string[] = [];
  rawBlipData.forEach((val) => {
    if (!newQuadrants.includes(val[QUADRANT_KEY])) newQuadrants.push(val[QUADRANT_KEY]);
  });
  return newQuadrants;
};

const getTechnologies = (rawBlipData: BlipType[]): TechItemType[] => {
  const newTechItems: Map<string, TechItemType> = new Map();

  rawBlipData.forEach((val) => {
    if (!newTechItems.has(val[TECH_KEY]))
      newTechItems.set(val[TECH_KEY], {
        uuid: uuidv4(),
        color: `#${(0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)}`,
        type: val[TECH_KEY],
      });
  });

  return Array.from(newTechItems.values());
};

const getUseCases = (rawBlipData: BlipType[]): SelectableItem[] => {
  const newUseCases: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((val) => {
    if (val[USE_CASE_KEY] !== '' && !newUseCases.has(val[USE_CASE_KEY]))
      newUseCases.set(val[USE_CASE_KEY], {
        uuid: uuidv4(),
        name: val[USE_CASE_KEY],
      } as SelectableItem);
  });
  return Array.from(newUseCases.values());
};

const getDisasterTypes = (rawBlipData: BlipType[]): SelectableItem[] => {
  const newDisterTypes: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((val) => {
    if (val[DISASTER_TYPE_KEY] !== '' && !newDisterTypes.has(val[DISASTER_TYPE_KEY]))
      newDisterTypes.set(val[DISASTER_TYPE_KEY], {
        uuid: uuidv4(),
        name: val[DISASTER_TYPE_KEY],
      } as SelectableItem);
  });
  return Array.from(newDisterTypes.values());
};

const getRadarData = (rawBlips: RawBlipType[]): RadarDataAndBLips => {
  const data = { ...RADAR_OPTIONS };
  const blips: BlipType[] = processBlips(data, rawBlips);
  const newHorizons = getHorizons(blips);
  data.horizons = newHorizons;
  const newQuadrants = getQuadrants(blips);
  data.quadrants = newQuadrants;
  const techItems = getTechnologies(blips);
  data.tech = techItems;
  return { data, blips };
};

const capitalize = (d: string): string => d.charAt(0).toUpperCase() + d.slice(1);

export const RadarUtilities = {
  processBlips,
  blipsSorting,
  getHorizons,
  getQuadrants,
  getTechnologies,
  getUseCases,
  getDisasterTypes,
  getRadarData,
  capitalize,
};
