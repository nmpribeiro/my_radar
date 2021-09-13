/* eslint-disable no-plusplus */
const blipsSorting = (a: BlipType, b: BlipType): number => {
  if (a.quadrant < b.quadrant) return -1;
  if (a.quadrant > b.quadrant) return 1;
  return 0;
};

const randomFromInterval = (min: number, max: number): number => Math.random() * (max - min) + min;

const processBlips = (
  data: RadarOptionsType,
  rawBlips: RawBlipType[],
  titleKey = 'Title',
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

    results.push({
      id: i,
      name: `${blip[titleKey]} ${blip.Quadrant} ${blip['Level of implementation']}`,
      description: blip.Description,
      quadrant: quadrantIndex,
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    });
  });

  return results;
};

const getNewHorizons = (rawBlipData: RawBlipType[], key: string): string[] => {
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

export const RadarUtilities = {
  blipsSorting,
  processBlips,
  getNewHorizons,
  getNewQuadrants,
};
