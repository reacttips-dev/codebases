import React from 'react';

export default function CircleBackground({ color, size, offset = {} }) {
  const dx = offset.x || 0;
  const dy = offset.y || 0;
  return (
    <circle cx={size / 2 + dx} cy={size / 2 + dy} r={size / 2} fill={color} />
  );
}
