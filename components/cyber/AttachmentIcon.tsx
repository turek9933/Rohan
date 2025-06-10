import React from 'react';
import { Svg, Path } from 'react-native-svg';

const AttachmentIcon = ({ color = '#000', size = 20 } : { color?: string; size?: number}) => {
  return (
    <Svg
    //   xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size / 13 * 24}
      viewBox="0 0 13 24"
      fill="none"
    >
      <Path
      fill={color}
      d="M10 19H3V6h2v11h3V2H2v20h9V6h2v18H0V0h10z"
      ></Path>
    </Svg>
  );
};

export default AttachmentIcon;