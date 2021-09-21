import React from 'react';

export function PaywallsLockIcon({
  width = 13,
  fillColor = 'white',
  ariaLabel = 'Subscriptions lock icon',
}: {
  width?: number;
  fillColor?: string;
  ariaLabel?: string;
}) {
  return (
    <svg
      width={width}
      viewBox="0 0 13 16"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaLabel}
      fill={fillColor}
      fillRule="evenodd"
    >
      <path
        clipRule="evenodd"
        d="M11.3 7.2h.75c.41 0 .75.36.75.8v7.2c0 .44-.34.8-.75.8H.75c-.41 0-.75-.36-.75-.8V8c0-.44.34-.8.75-.8h.76v-2C1.5 2.32 3.69 0 6.4 0c2.71 0 4.9 2.32 4.9 5.2v2zM6.4 1.6A3.13 3.13 0 003.2 4.7V6.4h6.4V4.7A3.13 3.13 0 006.4 1.6z"
      />
    </svg>
  );
}
