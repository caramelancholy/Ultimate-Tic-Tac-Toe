import type { ReactNode } from "react";

const MenuSurface = ({ children }: { children: ReactNode}) => {
  return(
    <div style={{ 
      position: 'absolute', 
      width: '100vw', 
      height: '100vh', 
      backgroundColor:'rgba(0, 0, 0, 0.2)'
    }}>
      <div style={{
        position: 'absolute', 
        top: '50%', left: '50%', 
        transform: 'translateX(-50%) translateY(-50%)', 
        borderRadius: '5px', 
        padding: '2vmin',
        textAlign: 'center'
      }} className="menu"> {children} </div>
    </div>
  )
}

export default MenuSurface;