import React from 'react';

export function OutlinedLock({
  fillColor = '#7F8287',
  className = '',
}: {
  fillColor?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="0.5"
        y="0.5"
        width="15"
        height="15"
        rx="1"
        fill={fillColor}
        stroke={fillColor}
      />
      <path
        d="M11.5 7H10.5V5.5C10.5 4.1 9.4 3 8 3C6.6 3 5.5 4.15 5.5 5.5V7H4.5C4.25 7 4 7.25 4 7.5V12.5C4 12.75 4.25 13 4.5 13H11.5C11.75 13 12 12.75 12 12.5V7.5C12 7.2 11.75 7 11.5 7ZM6.5 5.5C6.5 4.65 7.15 4 8 4C8.85 4 9.5 4.65 9.5 5.5V7H6.5V5.5Z"
        fill="white"
      />
    </svg>
  );
}
