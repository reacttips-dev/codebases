import React from 'react';
import { SvgProps } from '../../../../types/index.d';

export function ArrowLeftIcon({ fillColor = '#53585E', className }: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      className={className}
    >
      <path
        fill={fillColor}
        fillRule="evenodd"
        stroke={fillColor}
        d="M4.95 8.82l5.747-5.887a1.029 1.029 0 0 0 .01-1.43l-.226-.23a.96.96 0 0 0-1.386-.001L1.267 9.29a1.017 1.017 0 0 0 0 1.418l7.828 8.018a.964.964 0 0 0 1.386 0l.226-.232a1.025 1.025 0 0 0-.01-1.43L4.951 11.18H18c.552 0 .999-.455.999-1v-.36c0-.552-.452-1-1-1H4.95z"
      />
    </svg>
  );
}
