import type { PlayerType, UltBoardState } from "../types/Board";
import { ConnectionActions, ConnectionState } from "../types/Connection";
import { handleBoardStateChange, handleMove } from "../utils/utils";

export abstract class Player {
  locked: boolean;
  playerType: PlayerType;

  constructor(locked: boolean, playerType: PlayerType) {
    this.locked = locked;
    this.playerType = playerType;
  }


  abstract notifyMove(board_x?: number, board_y?: number, move_x?: number, move_y?: number): void;
}

export class LocalPlayer extends Player {
  constructor(playerType: PlayerType) {
    super(false, playerType);
  }

  notifyMove() { return; }
}

export class OnlinePlayer extends Player {
  ultBoardStateRef: React.RefObject<UltBoardState>;
  sendData: (data: any) => void;
  ultBoardStateChangeHandler: (_ultBoardState: UltBoardState, board_x: number, board_y: number, move_x: number, move_y: number) => void;

  constructor(
    playerType: PlayerType, 
    ultBoardStateRef: React.RefObject<UltBoardState>, 
    sendData: (data: any) => void, 
    ultBoardStateChangeHandler: (_ultBoardState: UltBoardState, board_x: number, board_y: number, move_x: number, move_y: number) => void 
  ) {
    super(true, playerType);
    this.sendData = sendData;
    this.ultBoardStateRef = ultBoardStateRef;
    this.ultBoardStateChangeHandler = ultBoardStateChangeHandler;
  }

  notifyMove(board_x: number, board_y: number, move_x: number, move_y: number): void {
      this.sendData({
        action: ConnectionActions.MOVE,
        command: {
          board_x,
          board_y,
          move_x,
          move_y
        }
      })
  }

  recieveData(data: any) {
    const action = data?.action;
    const command = data?.command;
    switch(action) {
      case ConnectionActions.MOVE:
        handleMove(
          this.ultBoardStateRef.current.boards[command?.board_y][command?.board_x],
          this.playerType,
          command?.move_x,
          command?.move_y,
          (board, move_x, move_y) => handleBoardStateChange(this.ultBoardStateRef.current, board, move_x, move_y, command?.board_x, command?.board_y, this.ultBoardStateChangeHandler)
        );
        break;
    }
  }
}