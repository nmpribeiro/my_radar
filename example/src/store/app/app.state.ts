import { StoreModule } from 'redux-auto-actions';

export interface AppState {
  counter: number;
}
export enum AppStateLabel {
  STATE = 'app',
}

export const appS = new StoreModule<ActionType, AppState>(AppStateLabel.STATE, {
  counter: 0,
});

export enum ActionType {
  INCREMENT = 'INCREMENT',
  DECREMENT = 'DECREMENT',
  RESET = 'RESET',
}
