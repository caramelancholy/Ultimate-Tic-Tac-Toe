import type { State } from "../types/Board"

type TileProps = {
  value: State;
  x: number;
  y: number;
  tileClickHandler: (x: number, y: number) => void;
} 

const Tile = (props: TileProps) => {
  
}