import React from 'react';
import { Svg, Path } from 'react-native-svg';

const ShareIcon = ({ color = '#000', size = 20 } : { color?: string; size?: number}) => {
  return (
    <Svg
    //   xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 21 21"
      fill="none"
    >
      <Path
      fill={color}
      d="M8 3H2v16h16v-6h2v8H0V1h8z"
      ></Path>
      <Path
      fill={color}
      d="m18.16 10.049-2.741-2.741-7.005 7.006L7 12.898l7.005-7.005-2.581-2.581L20.625.846z"
      ></Path>
    </Svg>
  );
};

export default ShareIcon;