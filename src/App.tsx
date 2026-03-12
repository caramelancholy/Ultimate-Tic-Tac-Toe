import { useState } from 'react';
import './App.css'
import { Player, State, Winner, type UltBoardState } from './types/Board';
import UltBoard from './components/UltBoard';

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
  });

  const [playerToggle, setPlayerToggle ] = useState(false);

  const handleUltBoardStateChange = (_UltBoardState: UltBoardState) => { 
    setPlayerToggle(!playerToggle)
    setUltBoardState(_UltBoardState);
  }

  return (
    <UltBoard ultBoardState={ultBoardState} player={playerToggle ? Player.CROSSES : Player.NAUGHTS} ultBoardStateChangeHandler={handleUltBoardStateChange}/>
  );
}

export default App;
