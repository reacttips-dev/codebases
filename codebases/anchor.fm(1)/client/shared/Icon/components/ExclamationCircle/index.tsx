import React from 'react';
import { SvgProps } from '../../types/index.d';

export function ExclamationCircle({
  fillColor = '#53585E',
  className,
}: SvgProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 15"
    >
      <path
        fill={fillColor}
        d="M6.33 9.5h1.34v1.33H6.33V9.5zm0-5.33h1.34v4H6.33v-4zM7 .83A6.66 6.66 0 107 14.16 6.66 6.66 0 007 .83zm.01 12A5.33 5.33 0 117 2.17a5.33 5.33 0 010 10.66z"
      />
    </svg>
  );
}
