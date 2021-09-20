import React, { FunctionComponent } from 'react';

import styles from './PopoverBoundary.less';

import { POPOVER_BOUNDARY_ELEMENT_ID } from './Popover';

export const PopoverBoundary: FunctionComponent = ({ children }) => (
  <main id={POPOVER_BOUNDARY_ELEMENT_ID} className={styles.popoverBoundary}>
    {children}
  </main>
);
