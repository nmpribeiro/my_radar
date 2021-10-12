import { StoreModule } from 'redux-auto-actions';
import { HORIZONS_KEY, QUADRANT_KEY, TECH_KEY, TITLE_KEY } from '../../constants/RadarConstants';
import { HorizonKey, QuadrantKey, TechKey, TitleKey } from '../../types';

export enum DataStateLabel {
  STATE = 'data',
}

export interface DataState {
  titleKey: TitleKey;
  quadrantKey: QuadrantKey;
  horizonKey: HorizonKey;
  techKey: TechKey;
  quadrantOrder: Record<QuadrantKey, number>;
  horizonOrder: Record<HorizonKey, number>;
}

export const dataModule = new StoreModule<ActionType, DataState>(DataStateLabel.STATE, {
  titleKey: TITLE_KEY,
  quadrantKey: QUADRANT_KEY,
  horizonKey: HORIZONS_KEY,
  techKey: TECH_KEY,
  quadrantOrder: { response: 1, recovery: 2, resilience: 3, preparedness: 4 },
  horizonOrder: { production: 1, validation: 2, prototype: 3, idea: 4 },
});

export enum ActionType {
  SET_TITLE_KEY = 'DATA/SET_TITLE_KEY',
  SET_QUADRANT_KEY = 'DATA/SET_QUADRANT_KEY',
  SET_HORIZON_KEY = 'DATA/SET_HORIZON_KEY',
  SET_TECH_KEY = 'DATA/SET_TECH_KEY',
  RESET = 'DATA/RESET',
}
