import '../App.css'
import { PlayerType, WinnerType, type BoardState, type UltBoardState } from '../types/Board';
import { Board } from './Board';
import Grid from './Grid';
import { checkWinner } from '../utils/utils.tsx';
import Overlay from './Overlay.tsx';

type UltBoardProps = {
  ultBoardState: UltBoardState;
  player: PlayerType;
  locked: boolean;
  ultBoardStateChangeHandler: (ultBoardState: UltBoardState, board_x: number, board_y: number, move_x: number, move_y: number) => void;
}

const UltBoard = (props: UltBoardProps) => {
  const { ultBoardState, player, locked, ultBoardStateChangeHandler } = props;

  const updateBoardEnabling = (boards: BoardState[][], x: number, y: number): void => {
    if(boards[y][x].winner == WinnerType.NONE) {
      boards.forEach((row, _y) => row.forEach((board, _x) => board.enabled = (x == _x && y == _y)))
    } else {
      boards.forEach((row) => row.forEach((board) => board.enabled = board.winner == WinnerType.NONE))
    }
  }

  const handleBoardStateChange = (_boardState: BoardState, move_x: number, move_y: number, board_x: number, board_y: number) => { 
    let newBoards = [...ultBoardState.boards];
    newBoards[board_y][board_x] = _boardState;
    const newWinner = checkWinner(newBoards.map(row => row.map(board => board.winner)));
    let newEnabled = false;

    if(newWinner == WinnerType.NONE) {
      newEnabled = true;
      updateBoardEnabling(newBoards, move_x, move_y);
    }

    ultBoardStateChangeHandler(
      {
        boards: newBoards,
        winner: newWinner,
        enabled: newEnabled
      }, 
      board_x,
      board_y,
      move_x,
      move_y
    )
  }

  return(  
    <div className='flexContainer squareFill' style={{padding: 'auto', flexDirection:'column', justifyContent: 'center'}}>
      <Grid items={ultBoardState.boards.map(
        (row, board_y) => row.map(
          (board, board_x) => 
            <Board 
              boardState={board} 
              player={player} 
              boardStateChangeHandler={ (boardState, move_x, move_y) => handleBoardStateChange(boardState, move_x, move_y, board_x, board_y)}
            />
          )
        )}
        lineThickness={1}
        lineColourLight='rgba(0, 0, 0, 0.80)'
        lineColourDark='rgba(255, 255, 255, 0.78)'
        padding={1.5}
      />
      <Overlay winner={ultBoardState.winner} enabled={ultBoardState.enabled} locked={locked}/>
    </div>
  )
}

export default UltBoard;