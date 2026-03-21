import { useEffect, useRef, useState, type ReactNode } from 'react';
import './App.css'
import { PlayerType, WinnerType, type UltBoardState } from './types/Board';
import UltBoard from './components/UltBoard';
import { LocalPlayer, OnlinePlayer, Player } from './classes/Player';
import { GameMode, GameState } from './types/Game';
import { generateEmptyUltBoardState } from './utils/utils';
import MenuSurface from './components/MenuSurface';
import usePeer from './hooks/usePeer';
import type { DataConnection } from 'peerjs';
import { ConnectionSource, ConnectionState } from './types/Connection';
 
function App() {
  // ======== STATE ========
  const [ultBoardState, setUltBoardState] = useState<UltBoardState>(generateEmptyUltBoardState());
  const [players, setPlayers] = useState<Player[]>([]);
  const [turn, setTurn] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.NONE);
  const [gameState, setGameState] = useState<GameState>(GameState.START);
 
  // Refs so that callbacks constructed once (e.g. inside OnlinePlayer) always
  // read the latest players/turn rather than stale closure values from the
  // render in which the OnlinePlayer was constructed.
  const ultBoardStateRef = useRef<UltBoardState>(ultBoardState);
  const playersRef = useRef<Player[]>(players);
  const turnRef = useRef<boolean>(turn);

 
  // ======== FUNCTIONS ========
 
  // No longer accepts players/turn as arguments — reads from refs instead,
  // so it is safe to pass as a stable reference into OnlinePlayer.
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
    // Read from refs — guaranteed to be the latest values even when called
    // from inside a stale OnlinePlayer closure.
    const currentPlayers = playersRef.current;
    const currentTurn = turnRef.current;
    currentPlayers[Number(!currentTurn)]?.notifyMove(board_x, board_y, move_x, move_y);
    if(_ultBoardState.winner != WinnerType.NONE) {
      setGameState(GameState.END);
    }
    setTurn(!currentTurn);
  }

  const onConnOpen = (conn: DataConnection, sendData: (data: unknown) => void, source: ConnectionSource) => {
    const onlineOpponent = new OnlinePlayer(Number(!source) as PlayerType, ultBoardStateRef, sendData, handleUltBoardStateChange);
    conn.on('data', (data) => {
      console.log(data);
      onlineOpponent.recieveData(data);
    });
    console.log(conn.metadata);
    initialiseOnlineGame(onlineOpponent, source);
  }
 
  const initialiseLocalGame = () => {
    setPlayers([new LocalPlayer(PlayerType.NAUGHTS), new LocalPlayer(PlayerType.CROSSES)]);
    setGameState(GameState.INPLAY);
  }
 
  const initialiseOnlineGame = (onlineOpponent: OnlinePlayer, source: ConnectionSource) => {
    const newPlayers: Player[] = [];
    newPlayers[source] = new LocalPlayer(source);
    newPlayers[Math.abs(source - 1)] = onlineOpponent;
    setPlayers(newPlayers);
    setGameState(GameState.INPLAY);
  }
 
  // ======== HOOKS ========
  const { peerId, connState, connectId, sendData } = usePeer(onConnOpen);
 
  // ======== EFFECTS ========
  useEffect(() => {
    ultBoardStateRef.current = ultBoardState;
    playersRef.current = players;
    turnRef.current = turn;
  },[ultBoardState, players, turn]);
 
  // ======== FLOW CONTROL ========
  const winnerMessage = 
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
      <UltBoard 
        ultBoardState={ultBoardState} 
        player={players[Number(turn)]?.playerType ?? PlayerType.NAUGHTS} 
        locked={players[Number(turn)]?.locked ?? false} 
        ultBoardStateChangeHandler={handleUltBoardStateChange}
      />
      {gameState != GameState.INPLAY && 
        <MenuSurface>
          {menuContent}
        </MenuSurface>
      }
    </>
  );
}
 
export default App;