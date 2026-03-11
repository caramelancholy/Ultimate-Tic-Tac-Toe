import { State } from "../types/Board";
import Naughts from '../assets/naughts.svg?react';
import Crosses from '../assets/crosses.svg?react';

type TileProps = {
  value: State;
  enabled: boolean;
  x: number;
  y: number;
  tileClickHandler: (x: number, y: number) => void;
} 

const Tile = (props: TileProps) => {
  const { value, x, y, tileClickHandler } = props;
  return(
    <div className={`flexContainer flexCentre ${value == State.NONE ? 'tileHover' : ''}`} style={{height: '100%'}} onClick={() => tileClickHandler(x, y)}>
      {value === State.NAUGHTS && <Naughts/>}
      {value === State.CROSSES && <Crosses/>}
    </div>
  )
}

export default Tile;