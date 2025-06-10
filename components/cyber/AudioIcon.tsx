import React from 'react';
import { Svg, Path } from 'react-native-svg';

const AudioIcon = ({ color = '#000', size = 20 } : { color?: string; size?: number}) => {
  return (
    <Svg
    //   xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size / 11 * 14}
      viewBox="0 0 11 14"
      fill="none"
    >
      <Path
      fill={color}
      d="M11 4v10H7v-1h3V6H5V1H1v5H0V0h7zm-4.75 9.25h-.5v-6.5h.5zm-3.75-.5H2v-5h.5zm2.5-.593h-.5V8.25H5zm-3.75-.907h-.5v-2.5h.5zm2.5-.5h-.5v-1.5h.5zM6 5h4L6 1z"
      ></Path>
    </Svg>
  );
};

export default AudioIcon;