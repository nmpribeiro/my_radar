/* eslint-disable no-plusplus */
const blipsSorting = (a: BlipType, b: BlipType): number => {
  if (a.quadrant < b.quadrant) return -1;
  if (a.quadrant > b.quadrant) return 1;
  return 0;
};

// const polarToCartesian = (r: number, t: number) => {
//   // const points = new Array(10).fill(undefined).map(() => ({
//   //   angle: d.startAngle + Math.random() * (d.endAngle - d.startAngle) - Math.PI / 2,
//   //   //radius: Math.random() * radius,
//   //   radius: radius / 2,
//   // }));
//   // radius to X and Y
//   // const x = r * Math.cos(t);
//   // const y = r * Math.sin(t);
//   // return [x, y];
// };

const processBlips = (data: RadarOptionsType, rawBlips: RawBlipType[]): BlipType[] => {
  // go through the data
  const results: BlipType[] = [];

  // const width = data.width || 800;
  // const height = data.height || 600;

  rawBlips.forEach(() => {
    // results.push({
    //   ...value,
    //   x: 0,
    //   y: 0,
    // });
    // const history = value.history.filter((e) => e.end == null || (e.end > currentTime && e.start < currentTime))[0];
    // let quadrantDelta = 0;
    // for (let j = 0; j < data.quadrants.length; j++) {
    //   if (data.quadrants[j] === history.quadrant) {
    //     quadrantDelta = quadAngle * j;
    //   }
    // }
    // const theta = history.positionAngle * quadAngle + quadrantDelta;
    // const r = history.position * horizonWidth;
    // const cart = polarToCartesian(r, theta);
    // const blip: BlipType = {
    //   id: i,
    //   name: value.name,
    //   description: value.description,
    //   quadrant: history.quadrant,
    //   r,
    //   theta,
    //   x: cart[0],
    //   y: cart[1],
    //   dx: null,
    //   dy: null,
    // };
    // if (history.direction) {
    //   const r2 = history.direction * horizonWidth;
    //   const theta2 = history.directionAngle * quadAngle + quadrantDelta;
    //   const vector = polarToCartesian(r2, theta2);
    //   blip.dx = vector[0] - cart[0];
    //   blip.dy = vector[1] - cart[1];
    // }
    // results.push(blip);
  });

  return results;
};

const getNewHorizons = (rawBlipData: RawBlipType[], key: string): string[] => {
  const newHorizons: string[] = [];
  rawBlipData.forEach((val) => {
    const newVal = val[key].charAt(0).toUpperCase() + val[key].slice(1);
    if (!newHorizons.includes(newVal)) newHorizons.push(newVal);
  });
  return newHorizons;
};

const getNewQuadrants = (rawBlipData: RawBlipType[], key = 'Quadrant'): string[] => {
  const newQuadrants: string[] = [];
  rawBlipData.forEach((val) => {
    const newVal = val[key].charAt(0).toUpperCase() + val[key].slice(1);
    if (!newQuadrants.includes(newVal)) newQuadrants.push(newVal);
  });
  return newQuadrants;
};

export const RadarUtilities = {
  blipsSorting,
  processBlips,
  getNewHorizons,
  getNewQuadrants,
};
