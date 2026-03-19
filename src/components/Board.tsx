import { PlayerType, TileState, WinnerType, type BoardState } from "../types/Board";
import Grid from "./Grid";
import Tile from "./Tile";
import { checkWinner, handleMove } from "../utils/utils.tsx";
import Overlay from "./Overlay.tsx";

type BoardProps = {
  boardState: BoardState;
  player: PlayerType;
  boardStateChangeHandler: (state: BoardState, x: number, y: number) => void;
}

export const Board = (props: BoardProps) => {
  const { boardState, player, boardStateChangeHandler } = props;
  const { tiles, winner, enabled } = props.boardState;

  const tileComponents = tiles.map((row, y) => row.map((state, x) => <Tile value={state} enabled={enabled} x={x} y={y} tileClickHandler={() => handleMove(boardState, player, x, y, boardStateChangeHandler)}/>));

  return(
    <div className="flexContainer" style={{position: 'relative'}}>
      <Grid 
        items={tileComponents}
        lineThickness={0.5}
        lineColourLight="rgba(0, 0, 0, 0.70)" 
        lineColourDark="rgba(255, 255, 255, 0.78)" 
        padding={1} 
        className="content"
      />
      <Overlay winner={winner} enabled={enabled} locked={false}/>
    </div>
  );
} 
