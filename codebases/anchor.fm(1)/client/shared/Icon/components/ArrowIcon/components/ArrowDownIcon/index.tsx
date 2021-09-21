import React from 'react';

interface Props {
  fillColor: string;
  className: string;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const ArrowDownIcon = ({
  fillColor,
  className,
}: Props): React.ReactElement<React.ReactNode> => (
  <svg viewBox="0 0 9 11" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      opacity="0.8"
      strokeLinejoin="round"
      className={className}
    >
      <g
        transform="translate(-193.000000, -536.000000)"
        fill={fillColor}
        stroke={fillColor}
      >
        <g transform="translate(194.000000, 537.000000)">
          <g>
            <g id="Icons-/-24-/-arrow-down-24">
              <polygon
                id="Shape"
                points="7.01707893 4.8006668 4.02813898 8.27674957 4.02813898 2.22044605e-14 3.44333367 2.22044605e-14 3.44333367 8.27733438 0.442697621 4.800082 3.10862447e-14 5.18254467 3.73690594 9.513028 7.46036136 5.18195986"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

ArrowDownIcon.defaultProps = defaultProps;

export default ArrowDownIcon;
