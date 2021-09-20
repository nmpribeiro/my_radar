/* eslint-disable no-console */
import { v4 as uuidv4 } from 'uuid';
// Lorem Ipsum from https://fatihtelis.github.io/react-lorem-ipsum/
import { loremIpsum } from 'react-lorem-ipsum';

import { Utilities } from '../../helpers/Utilities';
import {
  DISASTER_TYPE_KEY,
  horizonPriorityOrder,
  HORIZONS_KEY,
  quadrantPriorityOrder,
  QUADRANT_KEY,
  TECH_KEY,
  USE_CASE_KEY,
} from '../../constants/RadarData';

/* eslint-disable no-plusplus */
const blipsSorting = (a: BlipType, b: BlipType): number => {
  if (a.quadrantIndex < b.quadrantIndex) return -1;
  if (a.quadrantIndex > b.quadrantIndex) return 1;
  return 0;
};

// TODO: this is to be driven by supplied DATA
const getTechnologies = (rawBlipData: (RawBlipType | BlipType)[]): TechItemType[] => {
  const newTechItems: Map<string, TechItemType> = new Map();

  rawBlipData.forEach((val) => {
    if (!newTechItems.has(val[TECH_KEY]))
      newTechItems.set(val[TECH_KEY], {
        uuid: uuidv4(),
        color: `#${(0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)}`,
        type: val[TECH_KEY],
        slug: Utilities.createSlug(val[TECH_KEY]),
        description: loremIpsum({ p: 2, avgSentencesPerParagraph: 10, avgWordsPerSentence: 8 }),
      });
  });

  return Array.from(newTechItems.values());
};

const randomFromInterval = (min: number, max: number): number => Math.random() * (max - min) + min;

const processBlips = (data: RadarOptionsType, rawBlips: RawBlipType[]): BlipType[] => {
  // go through the data
  const results: BlipType[] = [];

  const width = data.width || 800;
  const height = data.height || 600;
  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;
  const horizonUnit = (horizonWidth - data.radarOptions.horizonShiftRadius) / data.horizons.length;

  rawBlips.forEach((blip) => {
    // TODO: get them a bit more appart
    // for instance: (quantize the area and assign to each square)

    // get angle
    const quadrantIndex = data.quadrants.indexOf(blip[QUADRANT_KEY] as QuadrantKey) - 1;
    const minAngle = quadrantIndex * (Math.PI / 2) + data.radarOptions.circlePadding;
    const maxAngle = quadrantIndex * (Math.PI / 2) + Math.PI / 2 - data.radarOptions.circlePadding;
    const angle = randomFromInterval(minAngle, maxAngle);

    // get radius
    const horizonIndex = data.horizons.indexOf(blip[HORIZONS_KEY] as HorizonKey) + 1;

    const outerRadius = horizonIndex * horizonUnit + data.radarOptions.horizonShiftRadius - data.radarOptions.radiusPadding;
    const innerRadius =
      (horizonIndex - 1) * horizonUnit +
      (horizonIndex === 0 ? 0 : data.radarOptions.horizonShiftRadius) +
      data.radarOptions.radiusPadding;

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

const getHorizons = (rawBlipData: (RawBlipType | BlipType)[]): HorizonKey[] => {
  const newHorizons: HorizonKey[] = [];
  rawBlipData.forEach((val) => {
    if (!newHorizons.includes(val[HORIZONS_KEY] as HorizonKey)) newHorizons.push(val[HORIZONS_KEY] as HorizonKey);
  });
  return newHorizons;
};

const getQuadrants = (rawBlipData: (RawBlipType | BlipType)[]): QuadrantKey[] => {
  const newQuadrants: QuadrantKey[] = [];
  rawBlipData.forEach((val) => {
    if (!newQuadrants.includes(val[QUADRANT_KEY] as QuadrantKey)) newQuadrants.push(val[QUADRANT_KEY] as QuadrantKey);
  });
  return newQuadrants;
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

const orderHorizons = (a: HorizonKey, b: HorizonKey): number => horizonPriorityOrder[a] - horizonPriorityOrder[b];
const orderQuadrants = (a: QuadrantKey, b: QuadrantKey): number => quadrantPriorityOrder[a] - quadrantPriorityOrder[b];

const getRadarData = (rawBlips: RawBlipType[], passedRadarData: RadarOptionsType): RadarDataBlipsAndLogic => {
  const radarData = { ...passedRadarData };

  const newHorizons = getHorizons(rawBlips);
  radarData.horizons = newHorizons.sort(orderHorizons);

  const newQuadrants = getQuadrants(rawBlips);
  radarData.quadrants = newQuadrants.sort(orderQuadrants);

  const techItems = getTechnologies(rawBlips);
  radarData.tech = techItems;

  const blips: BlipType[] = processBlips(radarData, rawBlips);
  return {
    radarData,
    blips,
    logic: {
      selectItem: () => {},
    },
  };
};

const capitalize = (d: string): string => d.charAt(0).toUpperCase() + d.slice(1);

const filterBlips = (blips: BlipType[], useCaseFilter = 'all', disasterTypeFilter = 'all'): BlipType[] => {
  let filtered = blips;
  if (useCaseFilter !== 'all') filtered = filtered.filter((i) => i[USE_CASE_KEY] === useCaseFilter);
  if (disasterTypeFilter !== 'all') filtered = filtered.filter((i) => i[DISASTER_TYPE_KEY] === disasterTypeFilter);
  return filtered;
};

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
  filterBlips,
};
