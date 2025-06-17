import React from 'react';
import { Svg, Path } from 'react-native-svg';

const RefreshIcon = ({ color = 'blue', size = 20} : { color?: string; size?: number}) => {
  return (
    <Svg
    //   xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
    >
      <Path
        fill={color}
        d="M17.799 11.25H17V18H5v-2h1v1h10v-5.75h-.799L16.5 9zM17 6h-1V5H6v5.75h.799L5.5 13l-1.299-2.25H5V4h12z"
      ></Path>
      <Path
        fill={color}
        fillRule="evenodd"
        d="M22 22H0V0h22zM1 21h20V1H1z"
        clipRule="evenodd"
      ></Path>
    </Svg>
  );
};

export default RefreshIcon;