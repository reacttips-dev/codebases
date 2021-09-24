import React from 'react';

export function MarketingVideoPlayIcon({
  width = 80,
  ariaLabel = 'Play icon',
}: {
  width?: number | string;
  ariaLabel?: string;
}) {
  return (
    <svg
      width={width}
      aria-label={ariaLabel}
      viewBox="0 0 84 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="40" cy="40" r="39.5" fill="white" stroke="none" />
      <path
        d="M52.53 40l-18.9-10.9v21.8L52.54 40z"
        fill="black"
        stroke="black"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
