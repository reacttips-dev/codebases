/**
 * Private module reserved for @coursera/cds-core package.
 */
import React from 'react';

import { createLargeSvgIcon } from '@core/utils/createSvgIcon';

export default createLargeSvgIcon('RadioUncheckedIcon', {
  large: (
    <circle cx="12" cy="12" fill="inherit" r="11.5" stroke="currentColor" />
  ),
});
