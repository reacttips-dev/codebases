import React from 'react';
import styles from './styles.sass';

const CircleButton = ({
  baseColor,
  className,
  children,
  size,
  onMouseEnter,
  onMouseLeave,
  ariaLabel,
  ...props
}) => (
  <button
    type="button"
    className={`${styles.circle} ${styles[baseColor]} ${className || ''}`}
    style={{
      height: `${size}px`,
      minHeight: `${size}px`,
      width: `${size}px`,
      minWidth: `${size}px`,
      borderRadius: `${`${Math.ceil(size / 2)}px`}`,
    }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    aria-label={ariaLabel}
    {...props}
  >
    {children}
  </button>
);

export default CircleButton;
