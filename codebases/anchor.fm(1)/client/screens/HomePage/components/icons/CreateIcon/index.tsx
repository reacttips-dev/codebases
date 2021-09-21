import React from 'react';

export function CreateIcon({
  width = 22,
  fillColor = 'white',
  ariaLabel = 'Microphone icon',
}: {
  width?: number;
  fillColor?: string;
  ariaLabel?: string;
}) {
  return (
    <svg
      aria-label={ariaLabel}
      width={width}
      viewBox="0 0 25 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.344 36.01c3.483-3.76 11.325-6.376 11.297-14.2M12.39 36.019C8.888 32.287 1.028 29.716 1 21.902M3.912 40l16.937-.055M12.371 36.083l.01 3.889"
        stroke={fillColor}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.458 18.032c0-1.382 5.63-4.257 5.63-5.658-.009-1.4-5.639 1.456-5.648.056-.01-1.401 5.63-4.258 5.63-5.658-.01-2.912-1.843-5.585-4.626-6.442-4.672-1.437-8.938 2.018-8.92 6.46l.01 2.921c.009 1.4 5.639-1.456 5.648-.055.01 1.4-5.63 4.257-5.63 5.658.01 1.4 5.64-1.456 5.649-.056.009 1.401-5.63 4.258-5.63 5.658.009 2.912 1.842 5.585 4.625 6.442 4.663 1.437 8.93-2.018 8.92-6.47l-.009-2.755c-.01-2.183-5.649 1.281-5.649-.1z"
        fill={fillColor}
      />
    </svg>
  );
}
