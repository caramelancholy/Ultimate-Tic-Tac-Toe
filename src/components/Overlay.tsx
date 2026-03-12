import { Winner } from "../types/Board";
import Naughts from "../assets/naughts.svg?react";
import Crosses from "../assets/crosses.svg?react";
import Tie from "../assets/tie.svg?react";

type OverlayProps = {
  winner: Winner,
  enabled: boolean
}

const Overlay = (props: OverlayProps) => {
  const { winner, enabled } = props;

  const generateOverlayContent = (winner: Winner) => {
    switch(winner) {
      case Winner.NONE: return({ component: <></>, className: 'empty'});
      case Winner.NAUGHTS: return({ component: <Naughts/>, className: 'naughtsLayer'});
      case Winner.CROSSES: return({ component: <Crosses/>, className: 'crossesLayer'});
      case Winner.TIE: return({ component: <Tie/>, className: 'tieLayer'});
    }
  }

  const { component, className } = generateOverlayContent(winner)

  return(
    <div className={`overlay${winner === Winner.NONE && enabled ? ' empty' : ''}`}>
      <div className={`layer ${className}`}/>
      {component}
    </div>
  )
}

export default Overlay;