import React from 'react';
import { RequestAccessBackground } from './RequestAccessBackground';

import styles from './RequestAccessPageSkeleton.less';

export const RequestAccessPageSkeleton = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className={styles.page}>
      <div className={styles.box}>{children}</div>
      <RequestAccessBackground />
    </div>
  );
};
