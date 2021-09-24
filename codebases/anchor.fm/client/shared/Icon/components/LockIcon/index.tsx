import React from 'react';
import { SvgProps } from '../../types/index.d';

interface Props {
  isInCircle?: boolean;
  circleColor?: string;
}

export function LockIcon({
  fillColor = '#53585E',
  className,
  isInCircle = false,
  circleColor = 'black',
  ariaHidden = false,
}: SvgProps & Props) {
  return (
    <svg
      viewBox={isInCircle ? '0 0 24 24' : '7 5 10 13'}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={ariaHidden}
    >
      <g fill="none" fillRule="evenodd">
        <g fillRule="nonzero">
          {isInCircle && <circle fill={circleColor} cx="12" cy="12" r="12" />}
          <path
            d="M16.4117647,10.85 L15.8235294,10.85 L15.8235294,9.225 C15.8235294,6.885 14.1176471,5 12,5 C9.88235294,5 8.17647059,6.885 8.17647059,9.225 L8.17647059,10.85 L7.58823529,10.85 C7.26470588,10.85 7,11.1425 7,11.5 L7,17.35 C7,17.7075 7.26470588,18 7.58823529,18 L16.4117647,18 C16.7352941,18 17,17.7075 17,17.35 L17,11.5 C17,11.1425 16.7352941,10.85 16.4117647,10.85 Z M9.5,8.87142857 C9.5,7.44285714 10.6111111,6.3 12,6.3 C13.3888889,6.3 14.5,7.44285714 14.5,8.87142857 L14.5,10.3 L9.5,10.3 L9.5,8.87142857 Z"
            fill={fillColor}
          />
        </g>
      </g>
    </svg>
  );
}
