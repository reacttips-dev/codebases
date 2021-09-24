import React from 'react';

export function FacebookIcon({ width = 24, height = 24, color = '#39579B' }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="20 5 24 24"
      aria-describedby="facebookLogoIcon"
    >
      <title id="facebookLogoIcon">Facebook logo</title>
      <path
        d="M43.00025,5 L21.0005,5 C20.44775,5 20,5.44775 20,5.99975 L20,28.00025 C20,28.55225 20.44775,29 21.0005,29 L32.75,29 L32.75,20 L29.75,20 L29.75,16.25 L32.75,16.25 L32.75,13.25 C32.75,10.15025 34.71275,8.62475 37.478,8.62475 C38.8025,8.62475 39.941,8.72375 40.2725,8.76725 L40.2725,12.00725 L38.35475,12.008 C36.851,12.008 36.5,12.72275 36.5,13.77125 L36.5,16.25 L40.25,16.25 L39.5,20 L36.5,20 L36.56,29 L43.00025,29 C43.55225,29 44,28.55225 44,28.00025 L44,5.99975 C44,5.44775 43.55225,5 43.00025,5"
        id="icon-facebook-24"
        stroke="none"
        fill={color}
        fillRule="evenodd"
      />
    </svg>
  );
}
