/**
 * Private module reserved for @coursera/cds-core package.
 */
import React from 'react';

import { createLargeSvgIcon } from '@core/utils/createSvgIcon';

export default createLargeSvgIcon('RadioCheckedIcon', {
  large: (
    <>
      <circle cx="12" cy="12" fill="white" r="11.5" stroke="currentColor" />

      <circle cx="12" cy="12" fill="currentColor" r="7" />
    </>
  ),
});
