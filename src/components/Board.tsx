/* ### Board Component ###
  props:
  - boardState: {
      board: 2d array,
      enabled: bool,
      winner: null | bool
  } 
  - boardStateChangeHandler: (state: boardState) =>  coid

  methods:
  - handleMove: (x: int, y: int) => void
    - Check enabled state
    - Validate coordinates & move position
    - Check and update win state

*/

import { Player, State, Winner, type BoardState } from "../types/Board";
import { Row } from "./Row";

type BoardProps = {
  boardState: BoardState;
  player: Player;
  boardStateChangeHandler: (state: BoardState) => void;
}

export const Board = (props: BoardProps) => {
  const { player, boardStateChangeHandler } = props;
  const { board, enabled } = props.boardState;

  const checkWinner = (b: BoardState["board"]): Winner => {
    //Check Straights
    for(let i = 0; i < 3; i++) {
      const rowCheck = b[i].every(val => val == State.NONE ? false : val == b[i][i]);
      const vertValues = [b[0][i], b[1][i], b[2][i]];
      const vertCheck = vertValues.every(val => val == State.NONE ? false : val == b[i][i]);
      if(rowCheck || vertCheck) return b[i][i];
    }
    //Check Crosses
    for(let i = 0; i < 2; i++) {
      const crossValues = [b[0][i * 2],b[1][1],b[2][2 - i * 2]];
      const crossCheck = crossValues.every(val => val == State.NONE ? false : val == b[i][i]);
      if(crossCheck) return b[1][1];
    }
    //Check for more playable spaces
    if(b.flat().includes(State.NONE)) return Winner.NONE; 
    //If none of the above conditions match, the game is a tie
    return Winner.TIE;
  }

  const handleMove = (x: number, y: number) => {
    //Guard cases
    if(!enabled) return; //Check board is enabled
    if(x > 2 || y > 2) return; //Check coordinates are within bounds
    if(board[y][x] !== State.NONE) return; //Check move is being played into an empty space

    //Update state
    const newBoard = [...board];
    newBoard[y][x] = player;
    const newWinner = checkWinner(newBoard);
    console.log(newWinner);
    const newEnabled = newWinner === Winner.NONE;

    boardStateChangeHandler({
      board: newBoard,
      winner: newWinner,
      enabled: newEnabled
    })
  } 

  return(
    <div className="flexContainer" style={{flexDirection: "column"}}>
      {board.map((row, y) => <Row row={row} y={y} moveHandler={handleMove}/>)}
    </div>
  );
} 
