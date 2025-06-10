import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function BackArrow({ size = 56, color = '#00F7FF' }: {size?: number; color?: string}) {
  return (
    <Svg
      width={size}
      height={(size * 41) / 56}
      viewBox="0 0 56 41"
      fill="none"
    >
      <Path
        d="M27.8984 28.7603V40.0874L0.570312 24.2163V21.0005H14.5469L27.8984 28.7603Z"
        fill={color}
      />
      <Path
        d="M55.2266 28.7603V40.0874L27.8984 24.2163V21.0005H41.875L55.2266 28.7603Z"
        fill={color}
      />
      <Path
        d="M27.8984 11.4155L14.752 19.0005H0.570312V16.0239L27.8984 0.151855V11.4155Z"
        fill={color}
      />
      <Path
        d="M55.2266 11.4155L42.0801 19.0005H27.8984V16.0239L55.2266 0.151855V11.4155Z"
        fill={color}
      />
    </Svg>
  );
}
