import React from 'react';

export const PauseIcon = ({
  iconSize = 24,
  fillColor = '#53585E',
  className,
}: {
  iconSize?: number;
  fillColor: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 12 12"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={iconSize}
    height={iconSize}
    aria-label="pause icon"
  >
    <rect x=".03" width="12" height="12" fill="none" />
    <path
      d="M8.45 0h1.83a.75.75 0 0 1 .72.75v10.5a.75.75 0 0 1-.75.75h-1.8a.75.75 0 0 1-.75-.75V.75A.75.75 0 0 1 8.45 0zM1.78 0h1.83a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H1.78a.76.76 0 0 1-.78-.75V.75A.76.76 0 0 1 1.78 0z"
      fill={fillColor}
    />
  </svg>
);
