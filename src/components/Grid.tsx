import type { ReactNode } from "react";

type GridProps = {
  items: (ReactNode)[][];
  lineThickness: number; // vmin units
  lineColourDark: string;
  lineColourLight: string;
  padding: number; // vmin units
  className?: string;
}

const Grid = (props: GridProps) => {

  const {items, lineThickness, lineColourDark, lineColourLight, padding, className} = props;

  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const styles = {
    boxShadow: `0px 0px 0px ${lineThickness}vmin ${isDarkMode ? lineColourDark : lineColourLight} inset`,
    padding: `${padding}vmin`
  }

  return (
    <div className={`flexContainer ${className}`} style={{ clipPath:`inset(${lineThickness + 0.3}vmin)`, flexDirection: 'column' }}>
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