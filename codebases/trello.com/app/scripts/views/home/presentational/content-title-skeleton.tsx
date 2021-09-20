import React from 'react';

export const ContentTitleSkeleton: React.FunctionComponent = (props) => (
  <svg
    className="titleSkeleton"
    width={138}
    height={12}
    viewBox="0 0 138 12"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="title-skeleton-animation">
        <stop offset="-200%" stopColor="#e2e4e6">
          <animate
            attributeName="offset"
            values="-2;1"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-190%" stopColor="#dee1e3">
          <animate
            attributeName="offset"
            values="-1.9;1.1"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-180%" stopColor="#dbdee0">
          <animate
            attributeName="offset"
            values="-1.8;1.2"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-170%" stopColor="#d8dcde">
          <animate
            attributeName="offset"
            values="-1.7;1.3"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-160%" stopColor="#d7dadc">
          <animate
            attributeName="offset"
            values="-1.6;1.4"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-150%" stopColor="#d6dadc">
          <animate
            attributeName="offset"
            values="-1.5;1.5"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-140%" stopColor="#d7dadc">
          <animate
            attributeName="offset"
            values="-1.4;1.6"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-130%" stopColor="#d8dcde">
          <animate
            attributeName="offset"
            values="-1.3;1.7"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-120%" stopColor="#dbdee0">
          <animate
            attributeName="offset"
            values="-1.2;1.8"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-110%" stopColor="#dee1e3">
          <animate
            attributeName="offset"
            values="-1.1;1.9"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-100%" stopColor="#e2e4e6">
          <animate
            attributeName="offset"
            values="-1;2"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>
    </defs>
    <path
      d="M1438 324h104a6 6 0 1 1 0 12h-104a6 6 0 1 1 0-12zm-22 0a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"
      transform="translate(-1410 -324)"
      fill="url(#title-skeleton-animation)"
      fillRule="evenodd"
    />
  </svg>
);
