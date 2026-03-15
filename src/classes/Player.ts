import type { PlayerType } from "../types/Board";

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
  constructor(playerType: PlayerType) {
    super(true, playerType);
  }

  notifyMove(board_x: number, board_y: number, move_x: number, move_y: number): void {
      
  }
}