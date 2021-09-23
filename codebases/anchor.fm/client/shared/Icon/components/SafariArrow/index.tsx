import React from 'react';

type FillColor = string;
type ClassName = string;

interface Props {
  fillColor: FillColor;
  className: ClassName;
}

const defaultProps = {
  className: '',
  fillColor: '#CED0D2',
};

const SafariArrow = ({
  fillColor,
  className,
}: Props): React.ReactElement<React.ReactNode> => (
  <svg
    viewBox="0 0 48 59"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g
        transform="translate(-305.000000, -556.000000)"
        stroke={fillColor}
        strokeWidth="3"
      >
        <g transform="translate(307.000000, 558.000000)">
          <path d="M0,0 C26.1204757,9.95903094 32.6359129,21.1332261 38,53" />
          <path d="M29.0361946,47.0822333 C28.6168525,46.3319898 31.8413078,48.9712453 38.7095605,55 C41.0585278,51.6638634 42.8220076,47.33053 44,42" />
        </g>
      </g>
    </g>
  </svg>
);

SafariArrow.defaultProps = defaultProps;

export { SafariArrow };
