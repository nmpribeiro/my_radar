// const entry = (
//   start: Date,
//   end: Date | null,
//   quadrant: string,
//   position: number,
//   positionAngle: number,
//   direction: number,
//   directionAngle: number
// ) => ({
//   start, // start date that this entry applies for
//   end, // end date for the entry
//   quadrant, // the quadrant label
//   position, // position is within the total of horizons.
//   positionAngle, // angles are fractions of pi/2 (ie of a quadrant)
//   direction, // the learning end point with the total of horizons.
//   directionAngle, // angles are fractions of pi/2 (ie of a quadrant)
// });

export const RADAR_DATA: RadarDataType = {
  title: 'Technology Radar',
  horizons: ['Production', 'Validation', 'Prototype', 'Idea'],
  quadrants: ['Preparedness', 'Recovery', 'Response', 'Resilience'],
  width: 600,
  height: 600,
};
