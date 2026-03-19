import { type BoardState, WinnerType, TileState, type UltBoardState, PlayerType } from "../types/Board";

export const checkWinner = (b: BoardState["tiles"] | WinnerType[][]): WinnerType => {
  //Check Straights
  for(let i = 0; i < 3; i++) {
    const rowCheck = b[i].every(val => val == TileState.NONE ? false : val == b[i][i]);
    const vertValues = [b[0][i], b[1][i], b[2][i]];
    const vertCheck = vertValues.every(val => val == WinnerType.NONE ? false : val == b[i][i]);
    if(rowCheck || vertCheck) return b[i][i];
  }
  //Check Crosses
  for(let i = 0; i < 2; i++) {
    const crossValues = [b[0][i * 2],b[1][1],b[2][2 - i * 2]];
    const crossCheck = crossValues.every(val => val == WinnerType.NONE ? false : val == b[i][i]);
    if(crossCheck) return b[1][1];
  }
  //Check for more playable spaces
  if(b.flat().includes(WinnerType.NONE)) return WinnerType.NONE; 
  //If none of the above conditions match, the game is a tie
  return WinnerType.TIE;
}

export const generateEmptyBoardState = (): BoardState => {
  return {
    tiles: Array.from(Array(3), () => new Array(3).fill(TileState.NONE)),
    winner: WinnerType.NONE,
    enabled: true
  }
}

export const generateEmptyUltBoardState = (): UltBoardState => {
  return {
    boards: Array.from(Array(3), () => Array.from(Array(3), () => generateEmptyBoardState())),
    winner: WinnerType.NONE,
    enabled: true
  }
}

export const handleMove = (board: BoardState, player: PlayerType, x: number, y: number, boardStateChangeHandler: (board: BoardState, x: number, y: number) => void) => {
  //Guard cases
  if(!board.enabled) return false; //Check board is enabled
  if(x > 2 || y > 2) return false; //Check coordinates are within bounds
  if(board.tiles[y][x] !== TileState.NONE) return false; //Check move is being played into an empty space

  //Update state
  const newTiles = [...board.tiles];
  newTiles[y][x] = player;
  const newWinner = checkWinner(newTiles);
  const newEnabled = newWinner === WinnerType.NONE;

  boardStateChangeHandler({
      tiles: newTiles,
      winner: newWinner,
      enabled: newEnabled
    }, x, y
  );

  return true;
} 

export const updateBoardEnabling = (boards: BoardState[][], x: number, y: number): void => {
  if(boards[y][x].winner == WinnerType.NONE) {
    boards.forEach((row, _y) => row.forEach((board, _x) => board.enabled = (x == _x && y == _y)))
  } else {
    boards.forEach((row) => row.forEach((board) => board.enabled = board.winner == WinnerType.NONE))
  }
}

export const handleBoardStateChange = (ultBoardState: UltBoardState, boardState: BoardState, move_x: number, move_y: number, board_x: number, board_y: number, ultBoardStateChangeHandler: (ultBoardState: UltBoardState, board_x: number, board_y: number, move_x: number, move_y: number) => void) => { 
  let newBoards = [...ultBoardState.boards];
  newBoards[board_y][board_x] = boardState;
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