export type ActionsType = {
  setRawBlips: <T>(blips: T[]) => void;
  setBlips: <T>(blips: T[]) => void;
};
export const ActionsInitialState: ActionsType = {
  setRawBlips: () => {},
  setBlips: () => {},
};
