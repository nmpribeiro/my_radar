import { HorizonKey, QuadrantKey, TechKey, TitleKey } from '../types';

const HORIZONS_KEY = 'Status/Maturity';
const QUADRANT_KEY = 'Disaster Cycle';
const TITLE_KEY = 'Ideas/Concepts/Examples';
const TECH_KEY = 'Technology';
// const USE_CASE_KEY = 'Use Case';
// const DISASTER_TYPE_KEY = 'Un Host Organisation';

const QUADRANT_ORDER = { response: 1, recovery: 2, resilience: 3, preparedness: 4 };
const HORIZON_ORDER = { production: 1, validation: 2, prototype: 3, idea: 4 };

export type DataStateType = {
  titleKey: TitleKey;
  quadrantKey: QuadrantKey;
  horizonKey: HorizonKey;
  techKey: TechKey;
  quadrantOrder: Record<QuadrantKey, number>;
  horizonOrder: Record<HorizonKey, number>;
};

export const DataInitialState = {
  titleKey: TITLE_KEY,
  quadrantKey: QUADRANT_KEY,
  horizonKey: HORIZONS_KEY,
  techKey: TECH_KEY,
  quadrantOrder: QUADRANT_ORDER,
  horizonOrder: HORIZON_ORDER,
};
