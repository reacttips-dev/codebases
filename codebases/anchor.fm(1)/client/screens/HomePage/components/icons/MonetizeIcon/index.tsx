import React from 'react';

export function MonetizeIcon({
  width = 22,
  fillColor = 'white',
  ariaLabel = 'Dollar sign icon',
}: {
  width?: number;
  fillColor?: string;
  ariaLabel?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      viewBox="0 0 22 44"
      aria-label={ariaLabel}
      fill="none"
    >
      <path
        d="M1 28.41c0 4.52 4.443 8.18 9.921 8.18s9.823-3.66 9.823-8.18c0-4.519-4.323-8.189-9.8-8.189l-.153-.01c-4.945 0-8.408-3.202-8.408-7.286s3.387-7.493 8.331-7.493c4.945 0 8.963 3.31 8.963 7.395M10.867 1v40"
        stroke={fillColor}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
