import { type BoardState, Winner, State } from "../types/Board";

export const checkWinner = (b: BoardState["board"] | Winner[][]): Winner => {
  //Check Straights
  for(let i = 0; i < 3; i++) {
    const rowCheck = b[i].every(val => val == State.NONE ? false : val == b[i][i]);
    const vertValues = [b[0][i], b[1][i], b[2][i]];
    const vertCheck = vertValues.every(val => val == Winner.NONE ? false : val == b[i][i]);
    if(rowCheck || vertCheck) return b[i][i];
  }
  //Check Crosses
  for(let i = 0; i < 2; i++) {
    const crossValues = [b[0][i * 2],b[1][1],b[2][2 - i * 2]];
    const crossCheck = crossValues.every(val => val == Winner.NONE ? false : val == b[i][i]);
    if(crossCheck) return b[1][1];
  }
  //Check for more playable spaces
  if(b.flat().includes(Winner.NONE)) return Winner.NONE; 
  //If none of the above conditions match, the game is a tie
  return Winner.TIE;
}