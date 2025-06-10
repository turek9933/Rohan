import * as React from "react"
import Svg, { Path } from "react-native-svg";
const SettingsIcon = ({ color = '#000', colorBackground = '#fff', size = 24, strokeWidth = 5 }: { color?: string; colorBackground?: string; size?: number, strokeWidth?: number }) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
  >
    <Path
      fill={colorBackground}
      stroke={color}
      strokeWidth={strokeWidth}
      d="M2.5 2.5h115v115H2.5z"
    />
    <Path
      stroke={color}
      strokeLinecap="square"
      strokeWidth={strokeWidth}
      d="M30 90h60M30 60h60M30 30h60"
    />
  </Svg>
)
export default SettingsIcon
