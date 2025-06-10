import React from 'react';
import { Svg, Path } from 'react-native-svg';

const CameraIcon = ({ color = 'blue', size = 20} : { color?: string; size?: number}) => {
  return (
    <Svg
    //   xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * 0.9}
      viewBox="0 0 20 18"
      fill="none"
    >
      <Path
      fill={color}
      fillRule="evenodd"
      d="M14 11H6V3h8zM8 9h4V5H8z"
      clipRule="evenodd"
    ></Path>
    <Path fill={color} d="M5 5H3V3h2z"></Path>
    <Path
      fill={color}
      fillRule="evenodd"
      d="M20 14h-5.333l.666 2H18v2H2v-2h2.667l.666-2H0V0h20zM7.333 14l-.666 2h6.666l-.666-2zM2 12h16V2H2z"
      clipRule="evenodd"
    ></Path>
    </Svg>
  );
};

export default CameraIcon;