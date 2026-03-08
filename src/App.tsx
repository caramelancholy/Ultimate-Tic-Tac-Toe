import { useState } from 'react';
import './App.css'
import { Player, State, Winner, type BoardState } from './types/Board';
import { Board } from './components/Board';

function App() {
  const [boardState, setBoardState] = useState<BoardState>({
    board: Array.from(Array(3), () => new Array(3).fill(State.NONE)),
    winner: Winner.NONE,
    enabled: true
  });

  const handleBoardStateChange = (_boardState: BoardState) => { setBoardState(_boardState); }

  return (
    <div className='flexContainer squareFill' style={{padding: 'auto'}}>
      <Board boardState={boardState} player={Player.NAUGHTS} boardStateChangeHandler={handleBoardStateChange}/>
    </div>
  );
}

export default App;
