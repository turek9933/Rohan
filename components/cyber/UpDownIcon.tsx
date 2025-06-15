import * as React from "react"
import Svg, { Path } from "react-native-svg"
const UpDownIcon = ({ color = '#000', size = 24, type = "up" }: { color?: string; size?: number, type?: "up" | "down"}) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size / 40 * 28}
    viewBox="0 0 40 28"
    fill="none"
  >
    <Path
      fill={color}
      d={type === "up" 
        ? "M21.087 14.182V0h2.977l15.871 27.328H28.673zM15.87 0h3.216v13.977l-7.76 13.351H0z" 
        : "M18.849 13.475v14.181h-2.977L0 .328h11.264zm5.215 14.181H20.85V13.68L28.609.328h11.326z"}
    />
      
  </Svg>
)
export default UpDownIcon
