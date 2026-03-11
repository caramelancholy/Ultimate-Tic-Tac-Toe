import type { ReactNode } from "react";

type GridProps = {
  items: (ReactNode)[][];
  lineThickness: number;
  lineColourDark: string;
  lineColourLight: string;
  padding: number;
  className?: string;
}

const Grid = (props: GridProps) => {

  const {items, lineThickness, lineColourDark, lineColourLight, padding, className} = props;

  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const styles = {
    boxShadow: `0px 0px 0px ${lineThickness}px ${isDarkMode ? lineColourDark : lineColourLight} inset`,
    padding: `${padding}px`
  }

  return (
    <div className={`flexContainer ${className}`} style={{ clipPath:`inset(${lineThickness + 1}px)`, flexDirection: 'column' }}>
        {items.map((row , y) => 
            <div className="flexContainer" key={y}>
              {row.map((e, x) => 
                <div className="flexContainer" style={styles} key={x}>
                  {e}
                </div>
              )}
            </div>
          )
        }
    </div>
  );
}

export default Grid;