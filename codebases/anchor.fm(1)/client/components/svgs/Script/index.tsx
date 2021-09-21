import React from 'react';

export function Script({
  width = 50,
  fillColor = 'white',
  ariaLabel = 'Script icon',
}: {
  width?: number;
  fillColor?: string;
  ariaLabel?: string;
}) {
  return (
    <svg
      width={width}
      viewBox="0 0 36 45"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaLabel}
      fill={fillColor}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 3.33C0 1.5 1.5 0 3.33 0h27.34C32.5 0 34 1.5 34 3.33v26.44A9.32 9.32 0 0023.2 43H3.34A3.33 3.33 0 010 39.67V3.33zm5.44 20.88c0-.8.65-1.46 1.46-1.46h20.2c.8 0 1.46.65 1.46 1.46v.37c0 .8-.65 1.46-1.46 1.46H6.9c-.8 0-1.46-.66-1.46-1.46v-.37zM6.9 6.33c-.8 0-1.46.66-1.46 1.46v.37c0 .8.65 1.46 1.46 1.46h20.2c.8 0 1.46-.65 1.46-1.46V7.8c0-.8-.65-1.46-1.46-1.46H6.9zM5.44 16c0-.8.65-1.46 1.46-1.46h20.2c.8 0 1.46.66 1.46 1.46v.37c0 .8-.65 1.46-1.46 1.46H6.9c-.8 0-1.46-.65-1.46-1.46V16z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30.46 36.6v7.35c0 .58.47 1.05 1.04 1.05.57 0 1.04-.47 1.04-1.05v-7.36l1.69 1.71a1.03 1.03 0 001.47 0c.4-.4.4-1.07 0-1.48l-3.47-3.51a1.04 1.04 0 00-.73-.31c-.13 0-.26.03-.38.08-.14.05-.26.13-.35.23l-3.47 3.5c-.4.42-.4 1.08 0 1.5.41.4 1.07.4 1.47 0l1.7-1.72z"
      />
    </svg>
  );
}
