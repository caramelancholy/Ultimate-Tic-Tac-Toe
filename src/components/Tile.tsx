import type { State } from "../types/Board"

type TileProps = {
  value: State;
  x: number;
  y: number;
  tileClickHandler: (x: number, y: number) => void;
} 

const Tile = (props: TileProps) => {
  const { value, x, y, tileClickHandler } = props;
  return(
    <div className="flexContainer flexCentre" onClick={() => tileClickHandler(x, y)}>
      {value}
    </div>
  )
}

export default Tile;