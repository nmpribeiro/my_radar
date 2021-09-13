import { v4 as uuidv4 } from 'uuid';

import { HORIZONS_KEY, RADAR_OPTIONS } from '../../constants/RadarData';
import { RadarContextType } from '../../services/RadarContext';

/* eslint-disable no-plusplus */
const blipsSorting = (a: BlipType, b: BlipType): number => {
  if (a.quadrant < b.quadrant) return -1;
  if (a.quadrant > b.quadrant) return 1;
  return 0;
};

const randomFromInterval = (min: number, max: number): number => Math.random() * (max - min) + min;

const DEBUG = true;

const processBlips = (
  data: RadarOptionsType,
  rawBlips: RawBlipType[],
  titleKey = 'Title',
  techKey = 'Technology',
  quadrantKey = 'Quadrant',
  horizonKey = 'Level of implementation'
): BlipType[] => {
  // go through the data
  const results: BlipType[] = [];

  const width = data.width || 800;
  const height = data.height || 600;
  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;
  const horizonUnit = (horizonWidth - data.horizonShiftRadius) / data.horizons.length;

  rawBlips.forEach((blip, i) => {
    // TODO: get them a bit more appart
    // for instance: (quantize the area and assign to each square)

    // get angle
    const quadrantIndex = data.quadrants.indexOf(blip[quadrantKey]) - 1;
    const angle = randomFromInterval(quadrantIndex * (Math.PI / 2), quadrantIndex * (Math.PI / 2) + Math.PI / 2);

    // get radius
    const horizonIndex = data.horizons.indexOf(blip[horizonKey]) + 1;
    const outerRadius = horizonIndex * horizonUnit - horizonUnit / 2 + data.horizonShiftRadius;
    const innerRadius = horizonIndex * horizonUnit + data.horizonShiftRadius;
    const radius = randomFromInterval(innerRadius, outerRadius);

    let debug = '';
    if (DEBUG) {
      debug = `
      <p>DEBUG</p>
      <p>quadrant: ${blip.Quadrant}</p>
      <p>level: ${blip['Level of implementation']}</p>
      <p>tech: ${blip.Technology}</p>
      `;
    }
    results.push({
      id: i,
      name: `${blip[titleKey]}${debug}`,
      description: blip.Description,
      quadrant: quadrantIndex,
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
      tech: blip[techKey],
    });
  });

  return results;
};

const getNewHorizons = (rawBlipData: RawBlipType[], key = HORIZONS_KEY): string[] => {
  const newHorizons: string[] = [];
  rawBlipData.forEach((val) => {
    if (!newHorizons.includes(val[key])) newHorizons.push(val[key]);
  });
  return newHorizons;
};

const getNewQuadrants = (rawBlipData: RawBlipType[], key = 'Quadrant'): string[] => {
  const newQuadrants: string[] = [];
  rawBlipData.forEach((val) => {
    if (!newQuadrants.includes(val[key])) newQuadrants.push(val[key]);
  });
  return newQuadrants;
};

const getTechnologies = (rawBlipData: RawBlipType[], key = 'Technology'): TechItemType[] => {
  const newTechItems: Map<string, TechItemType> = new Map();

  rawBlipData.forEach((val) => {
    if (!newTechItems.has(val[key]))
      newTechItems.set(val[key], {
        uuid: uuidv4(),
        color: `#${(0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)}`,
        type: val[key],
      });
  });

  return Array.from(newTechItems.values());
};

const getUseCases = (rawBlipData: RawBlipType[], key = 'Use case'): SelectableItem[] => {
  const newUseCases: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((val) => {
    if (!newUseCases.has(val[key]))
      newUseCases.set(val[key], {
        uuid: uuidv4(),
        name: val[key],
      } as SelectableItem);
  });
  return Array.from(newUseCases.values());
};

const getRadarData = (blips: RawBlipType[]): RadarContextType => {
  const data = { ...RADAR_OPTIONS };
  const newHorizons = getNewHorizons(blips, HORIZONS_KEY);
  data.horizons = newHorizons;
  const newQuadrants = getNewQuadrants(blips);
  data.quadrants = newQuadrants;
  const techItems = getTechnologies(blips);
  data.tech = techItems;
  return { data, blips };
};

const capitalize = (d: string): string => d.charAt(0).toUpperCase() + d.slice(1);

export const RadarUtilities = {
  blipsSorting,
  processBlips,
  getNewHorizons,
  getNewQuadrants,
  getTechnologies,
  getUseCases,
  getRadarData,
  capitalize,
};
