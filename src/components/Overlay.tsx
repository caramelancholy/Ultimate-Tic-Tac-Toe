import { WinnerType } from "../types/Board";
import Naughts from "../assets/naughts.svg?react";
import Crosses from "../assets/crosses.svg?react";
import Tie from "../assets/tie.svg?react";

type OverlayProps = {
  winner: WinnerType,
  enabled: boolean,
  locked: boolean
}

const Overlay = (props: OverlayProps) => {
  const { winner, enabled, locked } = props;

  const generateOverlayContent = (winner: WinnerType) => {
    switch(winner) {
      case WinnerType.NONE: return({ component: <></>, className: ''});
      case WinnerType.NAUGHTS: return({ component: <Naughts/>, className: 'naughtsLayer'});
      case WinnerType.CROSSES: return({ component: <Crosses/>, className: 'crossesLayer'});
      case WinnerType.TIE: return({ component: <Tie/>, className: 'tieLayer'});
    }
  }

  let { component, className } = generateOverlayContent(winner)



  return(
    <div className={`overlay${winner === WinnerType.NONE && enabled && !locked ? ' empty' : ''}${locked ? ' overlayClear' : '' }`}>
      {!locked && 
        <>
          <div className={`layer ${className}`}/>
          {component}
        </>
      }
    </div>
  )
}

export default Overlay;