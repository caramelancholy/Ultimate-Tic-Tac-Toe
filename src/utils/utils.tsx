import { type BoardState, WinnerType, TileState, type UltBoardState } from "../types/Board";

export const checkWinner = (b: BoardState["tiles"] | WinnerType[][]): WinnerType => {
  //Check Straights
  for(let i = 0; i < 3; i++) {
    const rowCheck = b[i].every(val => val == TileState.NONE ? false : val == b[i][i]);
    const vertValues = [b[0][i], b[1][i], b[2][i]];
    const vertCheck = vertValues.every(val => val == WinnerType.NONE ? false : val == b[i][i]);
    if(rowCheck || vertCheck) return b[i][i];
  }
  //Check Crosses
  for(let i = 0; i < 2; i++) {
    const crossValues = [b[0][i * 2],b[1][1],b[2][2 - i * 2]];
    const crossCheck = crossValues.every(val => val == WinnerType.NONE ? false : val == b[i][i]);
    if(crossCheck) return b[1][1];
  }
  //Check for more playable spaces
  if(b.flat().includes(WinnerType.NONE)) return WinnerType.NONE; 
  //If none of the above conditions match, the game is a tie
  return WinnerType.TIE;
}

export const generateEmptyBoardState = (): BoardState => {
  return {
    tiles: Array.from(Array(3), () => new Array(3).fill(TileState.NONE)),
    winner: WinnerType.NONE,
    enabled: true
  }
}

export const generateEmptyUltBoardState = (): UltBoardState => {
  return {
    boards: Array.from(Array(3), () => Array.from(Array(3), () => generateEmptyBoardState())),
    winner: WinnerType.NONE,
    enabled: true
  }
}