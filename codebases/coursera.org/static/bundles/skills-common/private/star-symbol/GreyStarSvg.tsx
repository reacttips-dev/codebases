import * as React from 'react';

type Props = {
  width?: number;
  height?: number;
};

const GreyStarSvg: React.SFC<Props> = ({ width = 86, height = 99 }) => {
  return (
    <svg role="presentation" width={width} height={height} viewBox="0 0 68 79" style={{ flexShrink: 0 }}>
      <title>Small Icon (GREY)</title>
      <g opacity="0.5">
        <path
          d="M3 57.752V21.248L34.5 3L66 21.256V57.752L34.5 76L3 57.752Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 19.75L34.016 0L68 19.75V59.25L34.016 79L0 59.242V19.75ZM62.816 22.7668L34.016 6.04165L5.216 22.7668V56.2252L34.016 72.9584L62.816 56.2332V22.7668Z"
          fill="#A8A8A8"
        />
        <path
          d="M63.0077 23.0957L68 20V60L63 56.9287L63.0077 23.0957Z"
          fill="#C1C1C1"
        />
        <path
          d="M0 59.0759L5.15031 56L34 72.9294L33.9521 79L0 59.0759Z"
          fill="#C1C1C1"
        />
        <path
          d="M5.18156 23L0 19.9593L34 0L33.968 6.05691L5.18156 23Z"
          fill="#C1C1C1"
        />
        <path
          d="M34.5 23.5L39.594 34.0349L51 35.7208L42.75 43.9245L44.6958 55.5L34.5 50.0389L24.3042 55.5L26.25 43.9245L18 35.7208L29.3981 34.0349L34.5 23.5Z"
          fill="#C1C1C1"
          stroke="#A8A8A8"
          strokeWidth={2 }
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

export default GreyStarSvg;
