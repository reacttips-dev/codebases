import React from 'react';

export function HeroPhone({
  text = '01:24',
  width = 355,
}: {
  text?: string;
  width?: number | string;
}) {
  return (
    <svg
      width={width}
      viewBox="0 0 355 500"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="A wireframe of a phone running Anchor, with a dot indicating that a recording is happening"
    >
      <defs>
        <linearGradient x1="50%" y1="0" x2="50%" y2="100%" id="gradient">
          <stop stopColor="#fff" offset="35.94%" />
          <stop stopColor="#fff" stopOpacity="0" offset="76.56%" />
        </linearGradient>
      </defs>
      <g transform="translate(1 1)" fill="none" fillRule="evenodd">
        <g transform="translate(109 73)">
          <circle fill="#f66181" fillRule="nonzero" cx="8" cy="8" r="8" />
          <path
            d="M40.9 15L38 10.28h-2.5V15h-3.13V.28h6.09c1.64 0 2.98.43 4.03 1.28a4.28 4.28 0 011.6 3.53 4.94 4.94 0 01-2.9 4.6L44.44 15H40.9zM37.9 3.16H35.5v4.26h2.41c2.05 0 3.07-.72 3.07-2.16 0-.72-.25-1.24-.76-1.58-.49-.35-1.26-.52-2.3-.52zM55.4 10.6h-6.97a2.16 2.16 0 002.3 1.9c1.06 0 1.9-.4 2.53-1.2l1.97 1.84a5.36 5.36 0 01-4.4 2.08 5.43 5.43 0 01-3.9-1.45 5.1 5.1 0 01-1.52-3.86 5.6 5.6 0 011.4-3.9 4.74 4.74 0 013.66-1.56c1.56 0 2.78.52 3.65 1.57a5.62 5.62 0 011.3 3.7l-.02.88zm-4.87-3.53a1.9 1.9 0 00-1.95 1.54h3.7c-.04-.44-.21-.8-.53-1.1-.33-.29-.73-.44-1.22-.44zm14.4 4.01l2.02 1.96a5.37 5.37 0 01-4.52 2.18 5.3 5.3 0 01-5.44-5.38 5.32 5.32 0 015.44-5.4c1.64 0 3.07.7 4.3 2.07l-2.01 1.95c-.66-.8-1.39-1.2-2.18-1.2a2.5 2.5 0 00-2.5 2.58 2.42 2.42 0 002.5 2.58c.9 0 1.69-.44 2.39-1.34zm4.57 2.6a5.18 5.18 0 01-1.56-3.83 5.32 5.32 0 015.44-5.4c1.54 0 2.83.52 3.87 1.55a5.14 5.14 0 011.57 3.85 5.3 5.3 0 01-5.44 5.38 5.3 5.3 0 01-3.88-1.54zM71.65 8a2.66 2.66 0 00-.67 1.87c0 .75.22 1.37.67 1.86.45.5 1.02.74 1.72.74s1.28-.25 1.72-.74c.45-.49.68-1.1.68-1.87 0-.75-.23-1.37-.68-1.86a2.23 2.23 0 00-1.72-.74c-.7 0-1.27.25-1.72.74zm15.52-3.4v2.87h-.47a2.7 2.7 0 00-2.07.84c-.52.55-.78 1.34-.78 2.4V15h-2.98V4.71h2.94v.92a3.17 3.17 0 012.56-1.07l.8.02zm.94 5.27c0-1.6.5-2.9 1.47-3.89 1-1 2.22-1.51 3.68-1.51 1.07 0 1.96.3 2.64.9V.28h2.98V15h-2.94v-.73c-.67.64-1.56.96-2.68.96a5.03 5.03 0 01-3.68-1.47 5.28 5.28 0 01-1.47-3.9zm7.14 1.93c.46-.5.7-1.15.7-1.93 0-.79-.24-1.43-.7-1.94a2.18 2.18 0 00-1.7-.75c-.69 0-1.26.25-1.72.75a2.8 2.8 0 00-.67 1.94c0 .78.22 1.42.67 1.93.46.5 1.03.75 1.72.75s1.25-.25 1.7-.75zm6.62 3.21V4.71h3V15h-3zm-.23-13.2c0-.5.17-.91.5-1.25.34-.33.74-.5 1.22-.5.49 0 .9.17 1.24.5.34.34.5.75.5 1.24 0 .48-.17.88-.52 1.22-.34.34-.74.5-1.22.5s-.88-.16-1.22-.5c-.33-.34-.5-.74-.5-1.22zm9.2 8.05V15h-2.98V4.71h2.94v.71a3.4 3.4 0 012.43-.96 4 4 0 013.05 1.2c.77.8 1.15 1.91 1.15 3.36V15h-3V9.25c0-.6-.14-1.07-.42-1.45-.28-.38-.7-.57-1.28-.57-1.26 0-1.9.88-1.9 2.63zm15.92 4.42v-.28c-.59.52-1.42.78-2.5.78a5 5 0 01-3.63-1.39 5.04 5.04 0 01-1.4-3.76c0-1.6.48-2.85 1.46-3.78a5.01 5.01 0 013.57-1.38c1 0 1.85.33 2.56.99V4.7h2.94v9.22c0 1.6-.5 2.89-1.49 3.88-.98 1-2.33 1.5-4.07 1.5-2.02 0-3.58-.7-4.68-2.08l2.08-2a2.97 2.97 0 002.58 1.32c.78 0 1.4-.2 1.87-.63.47-.42.71-.97.71-1.65zm.06-4.65c0-.72-.22-1.31-.67-1.76-.43-.46-.97-.7-1.61-.7-.63 0-1.17.24-1.62.7a2.43 2.43 0 00-.65 1.76c0 .72.22 1.3.65 1.77.45.45.99.67 1.62.67.64 0 1.18-.22 1.61-.67.45-.46.67-1.05.67-1.77z"
            fill="#fff"
            fillRule="nonzero"
          />
          <path
            d="M67.46 423.91a60.46 60.46 0 100-120.91 60.46 60.46 0 000 120.91z"
            fill="#f66181"
          />
          <path
            d="M75.52 364.1a8.75 8.75 0 01-8.74 8.76 8.75 8.75 0 01-8.73-8.76v-18.76a8.75 8.75 0 018.73-8.75 8.75 8.75 0 018.74 8.75v18.77zm2.24-9.79c0-.88.7-1.6 1.56-1.6.87 0 1.57.72 1.57 1.6v9.61c0 7.41-5.5 13.53-12.54 14.33v8.87h5.29c.86 0 1.57.72 1.57 1.6 0 .89-.7 1.6-1.57 1.6h-13.7c-.88 0-1.58-.71-1.58-1.6 0-.88.7-1.6 1.57-1.6h5.29v-8.87a14.33 14.33 0 01-12.54-14.33v-9.6c0-.9.7-1.61 1.56-1.61.87 0 1.57.72 1.57 1.6v9.61a11.1 11.1 0 0010.97 11.22 11.1 11.1 0 0010.98-11.22v-9.6z"
            fill="#fff"
          />
        </g>
        <rect
          opacity="0.3"
          stroke="url(#gradient)"
          strokeWidth="2.88"
          x=".44"
          y=".44"
          width="352.12"
          height="657.12"
          rx="38.87"
        />
        <text
          fontFamily="MaaxMono, Maax, monospace"
          fontSize="50"
          fontWeight="bold"
          fill="#fff"
          style={{ userSelect: 'none' }}
        >
          <tspan x="50%" y="235" textAnchor="middle">
            {text}
          </tspan>
        </text>
      </g>
    </svg>
  );
}
