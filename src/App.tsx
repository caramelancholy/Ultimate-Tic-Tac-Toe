import { useState, type ReactNode } from 'react';
import './App.css'
import { PlayerType, WinnerType, type UltBoardState } from './types/Board';
import UltBoard from './components/UltBoard';
import { LocalPlayer, OnlinePlayer, Player } from './classes/Player';
import { GameMode, GameState } from './types/Game';
import { generateEmptyUltBoardState } from './utils/utils';
import MenuSurface from './components/MenuSurface';

function App() {
  // ======== STATE ========
  // Ult Board State
  const [ultBoardState, setUltBoardState] = useState<UltBoardState>(generateEmptyUltBoardState());

  // Player State
  const [players, setPlayers] = useState<Player[]>([]);

  // Turn State
  const [turn, setTurn] = useState<boolean>(false);
  // Game Mode State
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.NONE);

  // Game State
  const [gameState, setGameState] = useState<GameState>(GameState.START);

  // ======== FUNCTIONS ========
  // Handlers
  const handleUltBoardStateChange = (_ultBoardState: UltBoardState, board_x: number, board_y: number, move_x: number, move_y: number) => { 
    onMove(_ultBoardState, board_x, board_y, move_x, move_y);
    setUltBoardState(_ultBoardState);
  }

  const handleGameModeButton = (gameMode: GameMode) => {
    setGameMode(gameMode);
    if(gameMode == GameMode.LOCAL) initialiseLocalGame();
  }

  const handleRestart = () => {
    setUltBoardState(generateEmptyUltBoardState());
    setPlayers([]);
    setTurn(false);
    setGameMode(GameMode.NONE);
    setGameState(GameState.START);
  }

  // Helpers
  const onMove = (_ultBoardState: UltBoardState, board_x: number, board_y: number, move_x: number, move_y: number) => {
    setTurn(!turn);
    players[Number(!turn)].notifyMove(board_x, board_y, move_x, move_y);
    if(_ultBoardState.winner != WinnerType.NONE) {
      setGameState(GameState.END);
    }
  }

  const initialiseLocalGame = () => {
    setPlayers([new LocalPlayer(PlayerType.NAUGHTS), new LocalPlayer(PlayerType.CROSSES)]);
    setGameState(GameState.INPLAY);
  }


  // ======== FLOW CONTROL ========
  // Menus
  let winnerMessage = 
    ultBoardState.winner == WinnerType.TIE ? 'Its a tie!' :
    ultBoardState.winner == WinnerType.NAUGHTS ? 'Naughts wins!' : 'Crosses wins!';

  let menuContent: ReactNode;

  switch(gameState) {
    case GameState.START:
      menuContent = <> 
        <h1>Ultimate Tic Tac Toe</h1>
        <h2>Select your game mode</h2>
        <button onClick={() => handleGameModeButton(GameMode.LOCAL)}>Local &#x1F3E0;</button>
        <button onClick={() => handleGameModeButton(GameMode.ONLINE)}>Online &#x1F310;</button>
      </>
      break;
    case GameState.END:
      menuContent = <>
        <h1>Game Over</h1>
        <h2>{winnerMessage}</h2>
        <button onClick={handleRestart}>Restart &#x1F504;</button>
      </>
      break;
    default:
      menuContent = <></>
      break;
  }

  return (
    <>
      <UltBoard ultBoardState={ultBoardState} player={players[Number(turn)]?.playerType ?? PlayerType.NAUGHTS} locked={players[Number(turn)]?.locked ?? false} ultBoardStateChangeHandler={handleUltBoardStateChange}/>
      {gameState != GameState.INPLAY && 
        <MenuSurface>
          {menuContent}
        </MenuSurface>
      }
    </>
  );
}

export default App;
