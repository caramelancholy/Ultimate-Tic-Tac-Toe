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
import Grid from "./Grid";
import Tile from "./Tile";
import { checkWinner } from "../utils/utils.tsx";
import Overlay from "./Overlay.tsx";

type BoardProps = {
  boardState: BoardState;
  player: Player;
  boardStateChangeHandler: (state: BoardState, x: number, y: number) => void;
}

export const Board = (props: BoardProps) => {
  const { player, boardStateChangeHandler } = props;
  const { board, winner, enabled } = props.boardState;

  const handleMove = (x: number, y: number) => {
    //Guard cases
    if(!enabled) return; //Check board is enabled
    if(x > 2 || y > 2) return; //Check coordinates are within bounds
    if(board[y][x] !== State.NONE) return; //Check move is being played into an empty space

    //Update state
    const newBoard = [...board];
    newBoard[y][x] = player;
    const newWinner = checkWinner(newBoard);
    const newEnabled = newWinner === Winner.NONE;

    boardStateChangeHandler({
        board: newBoard,
        winner: newWinner,
        enabled: newEnabled
      }, x, y
    )
  } 

  const tiles = board.map((row, y) => row.map((state, x) => <Tile value={state} enabled={enabled} x={x} y={y} tileClickHandler={handleMove}/>));

  return(
    <div className="flexContainer" style={{position: 'relative'}}>
      <Grid 
        items={tiles} 
        lineThickness={0.5}
        lineColourLight="rgba(0, 0, 0, 0.70)" 
        lineColourDark="rgba(255, 255, 255, 0.78)" 
        padding={1} 
        className="content"
      />
      <Overlay winner={winner} enabled={enabled} />
    </div>
  );
} 
