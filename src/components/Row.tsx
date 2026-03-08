/* ### Row Component ### 
  props:
    - row: State[]
    - y: int
    - moveHandler: (x: int, y: int)
*/

import { State } from "../types/Board";
import Tile from "./Tile";

type RowProps = {
  row: Array<State>;
  y: number;
  moveHandler: (x: number, y: number) => void;
}

export const Row = (props: RowProps) => {
  const { row, y, moveHandler } = props;

  return(
    <div className="flexContainer">
      {row.map((value, x) => <Tile value={value} x={x} y={y} tileClickHandler={moveHandler} />)}
    </div>
  )
}