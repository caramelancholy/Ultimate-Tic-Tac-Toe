export const GameMode = {
  NONE: -1,
  LOCAL: 0,
  ONLINE: 1
} as const;

export const GameState = {
  START: 0,
  INPLAY: 1,
  END: 2
} as const;

export type GameMode = typeof GameMode[keyof typeof GameMode];
export type GameState = typeof GameState[keyof typeof GameState];