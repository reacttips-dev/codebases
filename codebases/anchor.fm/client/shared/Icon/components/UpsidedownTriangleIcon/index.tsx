import React from 'react';
import { SvgProps } from '../../types/index.d';

export function UpsidedownTriangleIcon({
  fillColor = '#53585E',
  className,
  ariaHidden,
}: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 404.308 303.229"
      className={className}
      aria-hidden={ariaHidden}
    >
      <path fill={fillColor} d="M0,0h404.308L202.151,303.229L0,0z" />
    </svg>
  );
}
