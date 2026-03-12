export const Player = {
  NAUGHTS: 0,
  CROSSES: 1
} as const;

export const State = {
  NONE: -1,
  ...Player,
} as const;

export const Winner = {
  ...State,
  TIE: 2,
} as const;

export type Player = typeof Player[keyof typeof Player];
export type State = typeof State[keyof typeof State];
export type Winner = typeof Winner[keyof typeof Winner];

export interface IBoardState { 
  winner: Winner;
  enabled: boolean;
}

export interface BoardState extends IBoardState {
  board: State[][];
}  

export interface UltBoardState extends IBoardState {
  boards: BoardState[][];
}
