import React from 'react';
import { SvgProps } from '../../types/index.d';

export function OptionDotsIcon({
  fillColor = '#53585E',
  className,
  ariaHidden,
}: SvgProps) {
  return (
    <svg
      viewBox="0 0 23 5"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={ariaHidden}
    >
      <g
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        transform="translate(-339.000000, -60.000000)"
      >
        <g fill={fillColor}>
          <g transform="translate(350.500000, 62.500000) rotate(-90.000000) translate(-350.500000, -62.500000) translate(348.000000, 51.000000)">
            <circle cx="2.5" cy="2.5" r="2.5" />
            <circle cx="2.5" cy="11.5" r="2.5" />
            <circle cx="2.5" cy="20.5" r="2.5" />
          </g>
        </g>
      </g>
    </svg>
  );
}
