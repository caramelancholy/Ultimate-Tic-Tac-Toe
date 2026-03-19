import { useEffect, useState, type ReactNode } from 'react';
import './App.css'
import { PlayerType, WinnerType, type UltBoardState } from './types/Board';
import UltBoard from './components/UltBoard';
import { LocalPlayer, OnlinePlayer, Player } from './classes/Player';
import { GameMode, GameState } from './types/Game';
import { generateEmptyUltBoardState } from './utils/utils';
import MenuSurface from './components/MenuSurface';
import usePeer from './hooks/usePeer';
import type { DataConnection } from 'peerjs';
import { ConnectionState } from './types/Connection';

function App() {
  // ======== STATE ========
  const [ultBoardState, setUltBoardState] = useState<UltBoardState>(generateEmptyUltBoardState());
  const [players, setPlayers] = useState<Player[]>([]);
  const [turn, setTurn] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.NONE);
  const [gameState, setGameState] = useState<GameState>(GameState.START);

  // ======== FUNCTIONS ========
  const handleUltBoardStateChange = (_ultBoardState: UltBoardState, board_x: number, board_y: number, move_x: number, move_y: number) => { 
    handleMove(_ultBoardState, board_x, board_y, move_x, move_y);
    setUltBoardState(_ultBoardState);
  }

  const handleGameModeButton = (gameMode: GameMode) => {
    setGameMode(gameMode);
    if(gameMode == GameMode.LOCAL) initialiseLocalGame();
    if(gameMode == GameMode.ONLINE) {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      if(id) {
        connectId(id);
      }
    }
  }

  const handleRestart = () => {
    setUltBoardState(generateEmptyUltBoardState());
    setPlayers([]);
    setTurn(false);
    setGameMode(GameMode.NONE);
    setGameState(GameState.START);
  }

  const handleMove = (_ultBoardState: UltBoardState, board_x: number, board_y: number, move_x: number, move_y: number) => {
    setTurn(!turn);
    players[Number(!turn)].notifyMove(board_x, board_y, move_x, move_y);
    if(_ultBoardState.winner != WinnerType.NONE) {
      setGameState(GameState.END);
    }
  }

  const onConnOpen = (conn: DataConnection) => {
    const onlineOpponent = new OnlinePlayer(conn.metadata?.player, connState, ultBoardState, sendData, handleUltBoardStateChange);
    conn.on('data', (data) => {
      onlineOpponent.recieveData(data);
      console.log(data);
    });
    console.log(onlineOpponent);
    console.log(conn);
    initialiseOnlineGame(conn.metadata?.player!, onlineOpponent);
  }

  const initialiseLocalGame = () => {
    setPlayers([new LocalPlayer(PlayerType.NAUGHTS), new LocalPlayer(PlayerType.CROSSES)]);
    setGameState(GameState.INPLAY);
  }

  const initialiseOnlineGame = (localPlayerType: PlayerType, onlineOpponent: OnlinePlayer) => {
    setPlayers([new LocalPlayer(localPlayerType), onlineOpponent]);
    setGameState(GameState.INPLAY);
  }

  // ======== HOOKS ========
  const { peerId, connState, connectId, sendData } = usePeer(onConnOpen);

  // ======== EFFECTS ========


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
        <h2>{connState == ConnectionState.INITIALISING ? '...' : peerId}</h2>
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
