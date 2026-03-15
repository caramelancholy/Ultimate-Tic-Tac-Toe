export const PlayerType = {
  NAUGHTS: 0,
  CROSSES: 1
} as const;

export const TileState = {
  NONE: -1,
  ...PlayerType,
} as const;

export const WinnerType = {
  ...TileState,
  TIE: 2,
} as const;

export type PlayerType = typeof PlayerType[keyof typeof PlayerType];
export type TileState = typeof TileState[keyof typeof TileState];
export type WinnerType = typeof WinnerType[keyof typeof WinnerType];

export interface IBoardState { 
  winner: WinnerType;
  enabled: boolean;
}

export interface BoardState extends IBoardState {
  tiles: TileState[][];
}  

export interface UltBoardState extends IBoardState {
  boards: BoardState[][];
}
