/* eslint-disable no-plusplus */
const blipsSorting = (a: BlipType, b: BlipType): number => {
  if (a.quadrant < b.quadrant) return -1;
  if (a.quadrant > b.quadrant) return 1;
  return 0;
};

const polarToCartesian = (r: number, t: number) => {
  const x = r * Math.cos(t);
  const y = r * Math.sin(t);
  return [x, y];
};

const processBlips = (data: RadarDataType, rawBlips: RawBlipType[], currentTime = new Date()): BlipType[] => {
  // go through the data
  const results: BlipType[] = [];

  const quadAngle = (2 * Math.PI) / data.quadrants.length;
  const width = data.width || 800;
  const height = data.height || 600;
  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;

  rawBlips.forEach((value, i) => {
    const history = value.history.filter((e) => e.end == null || (e.end > currentTime && e.start < currentTime))[0];

    let quadrantDelta = 0;

    for (let j = 0; j < data.quadrants.length; j++) {
      if (data.quadrants[j] === history.quadrant) {
        quadrantDelta = quadAngle * j;
      }
    }

    const theta = history.positionAngle * quadAngle + quadrantDelta;

    const r = history.position * horizonWidth;
    const cart = polarToCartesian(r, theta);
    const blip: BlipType = {
      id: i,
      name: value.name,
      quadrant: history.quadrant,
      r,
      theta,
      x: cart[0],
      y: cart[1],
      dx: null,
      dy: null,
    };

    if (history.direction) {
      const r2 = history.direction * horizonWidth;
      const theta2 = history.directionAngle * quadAngle + quadrantDelta;
      const vector = polarToCartesian(r2, theta2);

      blip.dx = vector[0] - cart[0];
      blip.dy = vector[1] - cart[1];
    }
    results.push(blip);
  });

  return results;
};

export const RadarUtilities = {
  blipsSorting,
  processBlips,
};
