import React from 'react';

export const ContentCardSkeleton: React.FunctionComponent = (props) => (
  <svg
    className="cardSkeleton"
    width={420}
    height={320}
    viewBox="0 0 352 269"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient
        id="card-skeleton-animation"
        x2={352}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="-200%" stopColor="#f8f9f9">
          <animate
            attributeName="offset"
            values="-2;1"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-190%" stopColor="#f5f6f6">
          <animate
            attributeName="offset"
            values="-1.9;1.1"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-180%" stopColor="#f2f3f4">
          <animate
            attributeName="offset"
            values="-1.8;1.2"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-170%" stopColor="#eff1f2">
          <animate
            attributeName="offset"
            values="-1.7;1.3"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-160%" stopColor="#eeeff0">
          <animate
            attributeName="offset"
            values="-1.6;1.4"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-150%" stopColor="#edeff0">
          <animate
            attributeName="offset"
            values="-1.5;1.5"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-140%" stopColor="#eeeff0">
          <animate
            attributeName="offset"
            values="-1.4;1.6"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-130%" stopColor="#eff1f2">
          <animate
            attributeName="offset"
            values="-1.3;1.7"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-120%" stopColor="#f2f3f4">
          <animate
            attributeName="offset"
            values="-1.2;1.8"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-110%" stopColor="#f5f6f6">
          <animate
            attributeName="offset"
            values="-1.1;1.9"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="-100%" stopColor="#f8f9f9">
          <animate
            attributeName="offset"
            values="-1;2"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <rect width={352} height={269} rx={4} fill="#FFF" />
      <g transform="translate(16 181)" fill="url(#card-skeleton-animation)">
        <rect width={311} height={12} rx={6} />
        <rect y={40} width={301} height={12} rx={6} />
        <rect y={20} width={281} height={12} rx={6} />
        <rect y={60} width={151} height={12} rx={6} />
      </g>
      <g transform="translate(16 133)" fill="url(#card-skeleton-animation)">
        <rect width={32} height={32} rx={16} />
        <rect x={48} width={78} height={12} rx={6} />
        <rect x={48} y={22} width={48} height={10} rx={5} />
      </g>
      <rect
        fill="url(#card-skeleton-animation)"
        x={16}
        y={16}
        width={320}
        height={101}
        rx={4}
      />
    </g>
  </svg>
);
