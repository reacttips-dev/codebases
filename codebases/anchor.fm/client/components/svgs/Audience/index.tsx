import React from 'react';

export function Audience({
  width = 50,
  fillColor = 'white',
  ariaLabel = 'Audience icon',
}: {
  width?: number;
  fillColor?: string;
  ariaLabel?: string;
}) {
  return (
    <svg
      width={width}
      viewBox="0 0 54 37"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaLabel}
      fill={fillColor}
    >
      <path d="M27.14 16.28a8.19 8.19 0 008.14-8.14A8.11 8.11 0 0027.14 0 8.11 8.11 0 0019 8.14a8.19 8.19 0 008.14 8.14zM16 29.23a11.23 11.23 0 0122.47 0v7.55H16v-7.55zM7.04 22.58A5.2 5.2 0 012 17.29 5.2 5.2 0 017.04 12a5.2 5.2 0 015.04 5.29 5.2 5.2 0 01-5.04 5.29zM0 31.08C0 27.17 3.13 24 7 24s7 3.17 7 7.08V36H0v-4.92zM47.04 22.58A5.2 5.2 0 0142 17.29 5.2 5.2 0 0147.04 12a5.2 5.2 0 015.04 5.29 5.2 5.2 0 01-5.04 5.29zM40 31.08c0-3.91 3.13-7.08 7-7.08s7 3.17 7 7.08V36H40v-4.92z" />
    </svg>
  );
}
