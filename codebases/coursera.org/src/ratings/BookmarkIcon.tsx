/**
 * NOTE: This is generated file any changes to it can be overwritten at some point
 */
import React from 'react';

import { createSvgIcon } from '@coursera/cds-core';

export default createSvgIcon(
  'BookmarkIcon',
  {
    ltr: {
      small: ({ id }) => (
        <>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.5.5h9V16L8 12.625 3.5 16V.5zm1 1V14L8 11.375 11.5 14V1.5h-7z"
            fill="currentColor"
          />
        </>
      ),
      medium: ({ id }) => (
        <>
          <g clipPath={`url(#${id}_0)`}>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.5.5h11v19.54l-5.5-4.4-5.5 4.4V.5zm1 1v16.46l4.5-3.6 4.5 3.6V1.5h-9z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id={`${id}_0`}>
              <path fill="#fff" d="M0 0h20v20H0z" />
            </clipPath>
          </defs>
        </>
      ),
      large: ({ id }) => (
        <>
          <g clipPath={`url(#${id}_0)`}>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.5.5h13v23.567L12 18.651l-6.5 5.416V.5zm1 1v20.433l5.5-4.584 5.5 4.584V1.5h-11z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id={`${id}_0`}>
              <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
          </defs>
        </>
      ),
    },
  },
  false
);
