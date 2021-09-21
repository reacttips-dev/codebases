import React from 'react';

const Copy = ({ color = '#292F36', opacity = 0.8, size = 35 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 35 34"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill={color} fillOpacity={opacity}>
      <rect x="9" y="7" width="26" height="27" rx="2" />
      <path d="M25 0H2a2 2 0 0 0-2 2v23c0 1.1.9 2 2 2h2.9a2 2 0 0 0 2-2V6.94c0-1.1.9-2 2-2H27V2a2 2 0 0 0-2-2z" />
    </g>
  </svg>
);

export default Copy;

// #5F6369
