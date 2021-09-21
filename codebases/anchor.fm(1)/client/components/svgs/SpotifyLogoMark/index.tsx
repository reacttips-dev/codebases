import React from 'react';

export function SpotifyLogoMark({
  fillColor = '#1ED760',
  ariaLabel = 'Spotify logomark',
  width,
}: {
  fillColor?: string;
  width?: string | number;
  ariaLabel?: string;
}) {
  return (
    <svg
      width={width}
      aria-label={ariaLabel}
      viewBox="0 0 29 29"
      xmlns="http://www.w3.org/2000/svg"
      fill={fillColor}
      fillRule="nonzero"
    >
      <path d="M14.2 0a14.2 14.2 0 100 28.42A14.2 14.2 0 0014.2 0zm6.94 20.48a1.23 1.23 0 01-1.68.48 14.74 14.74 0 00-11.76-1.2 1.24 1.24 0 01-.76-2.35 17.2 17.2 0 017.02-.72c2.38.24 4.63.95 6.7 2.11.6.33.81 1.09.48 1.68zm1.7-4.31a1.23 1.23 0 01-1.67.52 19.31 19.31 0 00-14.33-1.44 1.24 1.24 0 01-.69-2.37 21.77 21.77 0 018.27-.74c2.78.29 5.44 1.08 7.9 2.36.6.32.84 1.06.52 1.67zm.62-3.6c-.19 0-.38-.04-.55-.12a23.87 23.87 0 00-8.28-2.4c-2.9-.29-5.8-.06-8.6.69a1.24 1.24 0 01-.64-2.39 26.34 26.34 0 019.5-.75c3.2.32 6.26 1.21 9.12 2.64a1.24 1.24 0 01-.55 2.34z" />
    </svg>
  );
}
