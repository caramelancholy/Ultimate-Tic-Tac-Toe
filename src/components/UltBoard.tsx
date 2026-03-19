import '../App.css'
import { PlayerType, type UltBoardState } from '../types/Board';
import { Board } from './Board';
import Grid from './Grid';
import { handleBoardStateChange } from '../utils/utils.tsx';
import Overlay from './Overlay.tsx';

type UltBoardProps = {
  ultBoardState: UltBoardState;
  player: PlayerType;
  locked: boolean;
  ultBoardStateChangeHandler: (ultBoardState: UltBoardState, board_x: number, board_y: number, move_x: number, move_y: number) => void;
}

const UltBoard = (props: UltBoardProps) => {
  const { ultBoardState, player, locked, ultBoardStateChangeHandler } = props;

  return(  
    <div className='flexContainer squareFill' style={{padding: 'auto', flexDirection:'column', justifyContent: 'center'}}>
      <Grid items={ultBoardState.boards.map(
        (row, board_y) => row.map(
          (board, board_x) => 
            <Board 
              boardState={board} 
              player={player} 
              boardStateChangeHandler={ (boardState, move_x, move_y) => handleBoardStateChange(ultBoardState, boardState, move_x, move_y, board_x, board_y, ultBoardStateChangeHandler)}
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