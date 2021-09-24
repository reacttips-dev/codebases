import React from 'react';

type FillColor = string;
type ClassName = string;

interface Props {
  fillColor: FillColor;
  className: ClassName;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const PlayIcon = ({
  fillColor,
  className,
}: Props): React.ReactElement<React.ReactNode> => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 4.1 5"
    className={className}
  >
    <g>
      <path
        fill={fillColor}
        d="M0,0.4v4.1C0,4.8,0.2,5,0.4,5c0.1,0,0.2,0,0.2-0.1l3.2-2.1C4.1,2.7,4.1,2.5,4,2.3 c0,0-0.1-0.1-0.1-0.1L0.7,0.1C0.5,0,0.2,0,0.1,0.2C0,0.3,0,0.4,0,0.4z"
      />
    </g>
  </svg>
);

PlayIcon.defaultProps = defaultProps;

export default PlayIcon;
