import React from 'react';
import { svgClassName } from '../../index';

type FillColor = string;
type ClassName = string;

interface Props {
  fillColor: FillColor;
  className: ClassName;
  strokeWidth: number;
}

const defaultProps = {
  className: svgClassName,
  fillColor: '#53585E',
  strokeWidth: '1.111',
};

const CloseIcon = ({
  fillColor,
  className,
  strokeWidth,
}: Props): React.ReactElement<React.ReactNode> => (
  <svg
    viewBox="0 0 19 19"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g fill="none" fillRule="evenodd">
      <g
        transform="translate(-387 -227)"
        fill={fillColor}
        stroke={fillColor}
        strokeWidth={strokeWidth}
      >
        <g transform="translate(387 227)">
          <g transform="rotate(-90 9 9)">
            <path d="M16.2143258,1.02718294 L15.9728171,0.785674201 C15.5389012,0.351758322 14.8353845,0.351758322 14.4014687,0.785674201 L8,7.18714286 L1.59853134,0.785674201 C1.16461546,0.351758322 0.461098821,0.351758322 0.0271829415,0.785674201 L-0.214325799,1.02718294 C-0.648241678,1.46109882 -0.648241678,2.16461546 -0.214325799,2.59853134 L6.18714286,9 L-0.214325799,15.4014687 C-0.648241678,15.8353845 -0.648241678,16.5389012 -0.214325799,16.9728171 L0.0271829415,17.2143258 C0.461098821,17.6482417 1.16461546,17.6482417 1.59853134,17.2143258 L8,10.8128571 L14.4014687,17.2143258 C14.8353845,17.6482417 15.5389012,17.6482417 15.9728171,17.2143258 L16.2143258,16.9728171 C16.6482417,16.5389012 16.6482417,15.8353845 16.2143258,15.4014687 L9.81285714,9 L16.2143258,2.59853134 C16.6482417,2.16461546 16.6482417,1.46109882 16.2143258,1.02718294 Z" />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

CloseIcon.defaultProps = defaultProps;

export default CloseIcon;
