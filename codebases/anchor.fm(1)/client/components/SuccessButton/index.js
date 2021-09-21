import React from 'react';
import CircleButtonBackground from '../CircleButtonBackground';
import { successButton } from './styles.sass';

export default function SuccessButton({
  className,
  disabled = false,
  size = 71,
  fgColor = '#292F36',
  bgColor = '#2EFFD9',
  type,
  children,
}) {
  return (
    <div
      className={`${successButton} ${className}`}
      style={{ width: size, height: size }}
    >
      {type ? (
        <button type={type} disabled={disabled}>
          {successIcon(fgColor, bgColor, size)}
          {children}
        </button>
      ) : (
        <span>
          {successIcon(fgColor, bgColor, size)}
          {children}
        </span>
      )}
    </div>
  );
}

function successIcon(fgColor, bgColor, size) {
  return (
    <svg width={size} height={size} viewBox="0 0 71 71">
      <CircleButtonBackground color={bgColor} size={71} />
      <polygon
        stroke="none"
        fill={fgColor}
        fillRule="evenodd"
        points="30.7248752 48.28 18.46 36.0151248 21.9186948 32.5564299 30.7248752 41.3380806 49.3429559 22.72 52.8016507 26.2032246"
      />
    </svg>
  );
}
