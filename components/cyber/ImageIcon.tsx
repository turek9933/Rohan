import React from 'react';
import { Svg, Path } from 'react-native-svg';

const ImageIcon = ({ color = '#000', size = 20 } : { color?: string; size?: number}) => {
  return (
    <Svg
    //   xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
    >
      <Path
      fill={color}
      d="M3 14h12l-3.75-5-3 4L6 10zm-3 4V0h18v18zm2-2h14V2H2z"
      ></Path>
    </Svg>
  );
};

export default ImageIcon;