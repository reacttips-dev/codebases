/**
 * Private module reserved for @coursera/cds-core package.
 */
import React from 'react';

import { createLargeSvgIcon } from '@core/utils/createSvgIcon';

export default createLargeSvgIcon('CheckboxUncheckedIcon', {
  large: (
    <rect
      fill="inherit"
      height="23"
      rx="1.5"
      stroke="currentColor"
      strokeLinejoin="round"
      width="23"
      x="0.5"
      y="0.5"
    />
  ),
});
