import React from 'react';
import { SvgProps } from '../../types/index.d';

export function SyncIcon({
  fillColor = '#fff',
  className,
  ariaHidden,
}: SvgProps) {
  return (
    <svg
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5772 10.6289C17.2192 17.1758 9.24023 19.9377 4.84158 15.3345H6.06911C7.29664 15.3345 7.29664 13.442 6.06911 13.442C4.53469 13.442 3.00028 13.442 1.46586 13.442V18.0964C1.41471 19.3239 3.30716 19.3239 3.30716 18.0964V16.3574C8.67761 22.4439 18.9582 19.017 19.4185 10.7312C19.5208 9.50367 17.6284 9.40138 17.5772 10.6289Z"
        fill={fillColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.004 9.70641C0.901707 10.9339 2.79415 11.0362 2.8453 9.8087C3.20333 3.31301 11.1823 0.499917 15.5809 5.15431H14.3534C13.1259 5.15431 13.1259 6.99561 14.3534 6.99561C15.8878 6.99561 17.4222 6.99561 18.9567 6.99561V2.39236C19.0078 1.16483 17.1154 1.16483 17.1154 2.39236V4.13137C11.7449 -2.0063 1.46433 1.42057 1.004 9.70641Z"
        fill={fillColor}
      />
    </svg>
  );
}
