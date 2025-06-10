import * as React from "react"
import Svg, { Path } from "react-native-svg"
const AddIcon = ({ color = '#000', colorBackground = '#fff', size = 24, strokeWidth = 5, transparentBackground = false, props1, props2 }: { color?: string; colorBackground?: string; size?: number, strokeWidth?: number, transparentBackground?: boolean, props1?: any, props2?: any }) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
  >
    <Path
      fill={transparentBackground ? 'none' : colorBackground}
      stroke={color}
      strokeWidth={strokeWidth}
      d="M2.5 2.5h115v115H2.5z"
      {...props1}
      />
    <Path
      stroke={color}
      strokeWidth={strokeWidth}
      d="m60 30 .021 29.979L90 60l-29.979.021L60 90l-.021-29.979L30 60l29.979-.021L60 30Z"
      {...props2}
    />
  </Svg>
)
export default AddIcon
