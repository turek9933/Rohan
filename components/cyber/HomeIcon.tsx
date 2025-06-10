import * as React from "react"
import Svg, { Path } from "react-native-svg";
const HomeIcon = ({ color = '#000', colorBackground = '#fff', size = 24 }: { color?: string; colorBackground?: string; size?: number }) => (
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
      strokeWidth={5}
      d="M2.5 2.5h115v115H2.5z"
    />
    <Path
      stroke={color}
      strokeLinecap="square"
      strokeWidth={5}
      d="M50 87V57h20v30M30 48l30-21 30 21v39H30V48Z"
    />
  </Svg>
)
export default HomeIcon
