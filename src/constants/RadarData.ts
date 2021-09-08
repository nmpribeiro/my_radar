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
    name: 'This is a D3 blip test (Recovery)',
    description: 'The d3 library for producing visualisation and data driven documents',
    links: ['http://d3js.org'],
    history: [
      entry(new Date(2013, 1, 29), new Date(2013, 9, 29), 'Recovery', 0.8, 0.5, 0.6, 0.5),
      entry(new Date(2013, 9, 29), null, 'Recovery', 0.6, 0.5, 0.2, 0.5),
    ],
  },
];

export const RADAR_DATA: RadarDataType = {
  title: 'Technology Radar',
  horizons: ['Production', 'Validation', 'Prototype', 'Idea'],
  quadrants: ['Preparedness', 'Recovery', 'Response', 'Resilience'],
  width: 600,
  height: 600,
};
