import * as React from 'react';

type Props = {
  width?: number;
  height?: number;
};

const GoldStarSvg: React.SFC<Props> = ({ width = 86, height = 99 }) => {
  return (
    <svg role="presentation" width={width} height={height} viewBox="0 0 86 99" style={{ flexShrink: 0 }}>
      <g fillRule="nonzero" fill="none">
        <path fill="#FFF" d="M3.25 71.77V26.42L42.52 3.75l39.27 22.68v45.34L42.52 94.44z" />
        <path
          d="M42.52 7.51l36 20.79v41.6l-36 20.79-36-20.8V28.3l36-20.79m0-7.51L0 24.55v49.09L42.52 98.2 85 73.65v-49.1L42.52 0z"
          fill="#EBA600"
        />
        <path
          fill="#FFC500"
          d="M78.52 28.35l6.52-3.8v49.1l-6.53-3.77zM0 73.64l6.45-3.79 36.13 20.86-.06 7.48zM6.48 28.29L0 24.55 42.52 0l-.04 7.45z"
        />
        <path
          stroke="#EBA600"
          strokeWidth={2}
          fill="#FFC500"
          strokeLinecap="round"
          d="M42.52 29.26l6.44 13.06 14.42 2.09-10.43 10.17 2.46 14.35-12.89-6.77-12.89 6.77 2.46-14.35-10.43-10.17 14.41-2.09z"
        />
      </g>
    </svg>
  );
};

export default GoldStarSvg;
