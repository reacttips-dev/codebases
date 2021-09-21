// adapted from ionic framework https://github.com/driftyco/ionic
import React from 'react';
import { spinner } from './styles.sass';

const NUM_LINES = 12;

export default function WaitIndicator({
  className = '',
  size = 46,
  fgColor = '#FFFFFF',
  style = {},
  duration = 1000,
}) {
  const lines = [];
  for (let index = 0; index < NUM_LINES; index++) {
    const transform = `rotate(${30 * index + (index < 6 ? 180 : -180)}deg)`;

    const animationDelay = `${-(duration - (duration / NUM_LINES) * index)}ms`;
    const animationDuration = `${duration}ms`;
    lines.push(
      <line
        key={index}
        y1={12}
        y2={20}
        transform="translate(32,32)"
        stroke={fgColor}
        style={{
          transform,
          WebkitTransform: transform,
          animationDelay,
          WebkitAnimationDelay: animationDelay,
          animationDuration,
        }}
      />
    );
  }
  return (
    <div className={`${className} ${spinner}`} style={{ ...style }}>
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <g transform="translate(32,32)">{lines}</g>
      </svg>
    </div>
  );
}
