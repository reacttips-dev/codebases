/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';

const SVGCertificateTrophy = (props) => (
  <svg
    width={32}
    height={32}
    fill="none"
    {...props}
    css={css`
      flex-shrink: 0;
    `}
  >
    <path d="M25.2 13.2V.8H6.8v12.4" fill="#F2D049" />
    <path d="M25.2 13.2V.8H6.8v12.4" stroke="#000" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.8 13.2c0 4.417 4.121 8 9.2 8 5.08 0 9.2-3.583 9.2-8" fill="#F2D049" />
    <path
      d="M6.8 13.2c0 4.417 4.121 8 9.2 8 5.08 0 9.2-3.583 9.2-8M25.334 9.333c3.313 0 6-3.513 6-6.666h-6M6.667 9.333c-3.313 0-6-3.513-6-6.666h6M10.447 28.667l-1.113 2.666M22.667 31.333H9.334M10.667 28.687c2.207 0 4-2.374 4-4.474v-2.86M21.554 28.667l1.113 2.666M21.334 28.687c-2.207 0-4-2.374-4-4.474v-2.86"
      stroke="#000"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m16 5.333 1.233 2.634L20 8.393l-2 2.047.473 2.893L16 11.967l-2.473 1.366L14 10.44l-2-2.047 2.767-.426L16 5.333z"
      fill="#FFEEAC"
      stroke="#000"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SVGCertificateTrophy;
