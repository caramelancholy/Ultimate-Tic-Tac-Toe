import { useState } from 'react';
import './App.css'
import { Player, State, Winner, type BoardState, type UltBoardState } from './types/Board';
import { Board } from './components/Board';
import Grid from './components/Grid';
import { checkWinner, generateOverlayContent } from './utils/utils';

function App() {
  const [ultBoardState, setUltBoardState] = useState<UltBoardState>({
    boards: Array.from(Array(3), () => 
      Array.from(Array(3), () => 
        ({
          board: Array.from(Array(3), () => new Array(3).fill(State.NONE)),
          winner: Winner.NONE,
          enabled: true
        })
      )
    ),
    winner: Winner.NONE,
    enabled: true
  })

  const [playerToggle, setPlayerToggle ] = useState(false);

  const updateBoardEnabling = (boards: BoardState[][], x: number, y: number): void => {
    if(boards[y][x].winner == Winner.NONE) {
      boards.forEach((row, _y) => row.forEach((board, _x) => board.enabled = (x == _x && y == _y)))
    } else {
      boards.forEach((row) => row.forEach((board) => board.enabled = board.winner == Winner.NONE))
    }
  }

  const handleBoardStateChange = (_boardState: BoardState, move_x: number, move_y: number, board_x: number, board_y: number) => { 
    let newBoards = [...ultBoardState.boards];
    newBoards[board_y][board_x] = _boardState;
    const newWinner = checkWinner(newBoards.map(row => row.map(board => board.winner)));
    let newEnabled = false;

    if(newWinner == Winner.NONE) {
      newEnabled = true;
      setPlayerToggle(!playerToggle);
      updateBoardEnabling(newBoards, move_x, move_y)
    }

    setUltBoardState({
      boards: newBoards,
      winner: newWinner,
      enabled: newEnabled
    })
  }

  const { component, className } = generateOverlayContent(ultBoardState.winner);


  return (
    <div className='flexContainer squareFill' style={{padding: 'auto', flexDirection:'column', justifyContent: 'center'}}>
      <Grid items={ultBoardState.boards.map(
        (row, board_y) => row.map(
          (board, board_x) => 
            <Board 
              boardState={board} 
              player={playerToggle ? Player.CROSSES : Player.NAUGHTS} 
              boardStateChangeHandler={ (boardState, move_x, move_y) => handleBoardStateChange(boardState, move_x, move_y, board_x, board_y)}
            />
          )
        )}
        lineThickness={5}
        lineColourLight='rgba(0, 0, 0, 0.80)'
        lineColourDark='rgba(255, 255, 255, 0.78)'
        padding={8}
      />
      <div className={`overlay${ultBoardState.winner === Winner.NONE && ultBoardState.enabled ? ' empty' : ''}`}>
        <div className={`layer ${className}`}/>
        {component}
      </div>
    </div>
  );
}

export default App;
