// Radar constants
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;
const HORIZON_SHIFT_RADIUS = 30;
const RADIUS_PADDING = 10;
const CIRCLE_PADDING = Math.PI / 18;

export const DEFAULT_TITLE = 'Technology Radar';

export const RADAR_OPTIONS: RadarOptionsType = {
  title: DEFAULT_TITLE,
  horizons: [],
  quadrants: [],
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  radarOptions: {
    horizonShiftRadius: HORIZON_SHIFT_RADIUS,
    radiusPadding: RADIUS_PADDING,
    circlePadding: CIRCLE_PADDING,
  },
  tech: [],
};

export const horizonPriorityOrder: Record<HorizonKey, number> = { production: 1, validation: 2, prototype: 3, idea: 4 };
export const quadrantPriorityOrder: Record<QuadrantKey, number> = { response: 1, recovery: 2, resilience: 3, preparedness: 4 };

export const HORIZONS_KEY = 'Level of implementation';
export const QUADRANT_KEY = 'Quadrant';
export const TITLE_KEY = 'Title';
export const TECH_KEY = 'Technology';
export const USE_CASE_KEY = 'Use case';
export const DISASTER_TYPE_KEY = 'Origin';
