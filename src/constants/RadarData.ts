// export const BLIP_DATA: BlipType[] = [
//   {
//     id: 'a_name',
//     name: 'A name',
//     quadrant: 'languages',
//     r: 12,
//     theta: 40,
//     x: 3,
//     y: 4,
//   },
// ];

const entry = (
  start: Date,
  end: Date | null,
  quadrant: string,
  position: number,
  positionAngle: number,
  direction: number,
  directionAngle: number
) => ({
  start, // start date that this entry applies for
  end, // end date for the entry
  quadrant, // the quadrant label
  position, // position is within the total of horizons.
  positionAngle, // angles are fractions of pi/2 (ie of a quadrant)
  direction, // the learning end point with the total of horizons.
  directionAngle, // angles are fractions of pi/2 (ie of a quadrant)
});

export const RAW_BLIP_DATA: RawBlipType[] = [
  {
    name: 'This is D3 test',
    description: 'The d3 library for producing visualisation and data driven documents',
    links: ['http://d3js.org'],
    history: [
      entry(new Date(2013, 1, 29), new Date(2013, 9, 29), 'frameworks', 0.8, 0.5, 0.6, 0.5),
      entry(new Date(2013, 9, 29), null, 'frameworks', 0.6, 0.5, 0.2, 0.5),
    ],
  },
];

export const RADAR_DATA: RadarDataType = {
  horizons: ['discover', 'assess', 'learn', 'use'],
  quadrants: ['languages', 'frameworks', 'tools', 'big data'],
  width: 850,
  height: 850,
};
