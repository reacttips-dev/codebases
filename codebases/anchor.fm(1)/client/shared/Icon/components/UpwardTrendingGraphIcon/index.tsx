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

const UpwardTrendingGraphIcon = ({
  fillColor,
  className,
}: Props): React.ReactElement<React.ReactNode> => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 31.2 30.8"
    className={className}
  >
    <g>
      <g transform="translate(2 1)">
        <g>
          <path
            className="st0"
            d="M-0.4-0.4c-0.5,0-1,0.5-1,1v27.6c0,0.6,0.4,1,1,1h28c0.5,0,1-0.5,1-1c0-0.6-0.4-1-1-1H0.6V0.6 C0.6,0.1,0.1-0.4-0.4-0.4L-0.4-0.4z M21.2,4.7c-0.6,0-1.1,0.6-1,1.1c0,0.5,0.5,1,1,1h2.8l-8.7,8.4l-3.1-2.7 c-0.2-0.2-0.5-0.4-0.8-0.4c-0.2,0-0.4,0.1-0.6,0.3l-6.5,6.1c-0.4,0.3-0.5,1.1-0.1,1.5c0.3,0.4,1,0.4,1.4,0.1l5.9-5.5l3.1,2.7 c0.3,0.4,1,0.4,1.4,0.1l9.4-9.2v3c0,0.5,0.5,1,1,1s1-0.5,1-1V5.7c0-0.5-0.5-1-1-1H21.2z"
            fill={fillColor}
          />
        </g>
      </g>
    </g>
  </svg>
);

UpwardTrendingGraphIcon.defaultProps = defaultProps;

export default UpwardTrendingGraphIcon;
