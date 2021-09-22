/**
 * Private module reserved for @coursera/cds-core package.
 */
import React from 'react';

import { createLargeSvgIcon } from '@core/utils/createSvgIcon';

export default createLargeSvgIcon('CheckboxCheckedIcon', {
  large: (
    <>
      <path
        d="M0 2C0 0.89543 0.895431 0 2 0H22C23.1046 0 24 0.895431 24 2V22C24 23.1046 23.1046 24 22 24H2C0.89543 24 0 23.1046 0 22V2Z"
        fill="currentColor"
      />

      <rect
        height="22"
        rx="1"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        width="22"
        x="1"
        y="1"
      />

      <path
        d="M4.22217 10.8889L9.77772 17L19.7777 7"
        stroke="#fff"
        strokeMiterlimit="10"
        strokeWidth="3"
      />
    </>
  ),
});
