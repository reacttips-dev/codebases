import React, { FunctionComponent } from 'react';

import styles from './HeaderSkeleton.less';

export const HeaderSkeleton: FunctionComponent<{
  backgroundColor?: string;
}> = ({ backgroundColor = '#00000026' }) => (
  <div
    style={{
      backgroundColor,
      height: 32,
      padding: 4,
      display: 'flex',
    }}
  >
    <div style={{ display: 'flex', flexGrow: 1 }}>
      <div className={styles.buttonSkeleton} style={{ marginRight: 4 }} />
      <div
        className={styles.buttonSkeleton}
        style={{ width: 90, marginRight: 4 }}
      />
      <div className={styles.buttonSkeleton} style={{ width: 184 }} />
    </div>
    <div
      style={{
        left: '50%',
        position: 'absolute',
        top: 5,
        transform: 'translateX(-50%)',
        opacity: 0.5,
      }}
    >
      <div className={styles.newLogo} />
    </div>
    <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
      <div className={styles.buttonSkeleton} style={{ marginRight: 4 }} />
      <div className={styles.buttonSkeleton} style={{ marginRight: 4 }} />
      <div className={styles.buttonSkeleton} style={{ marginRight: 4 }} />
      <div className={styles.buttonSkeleton} style={{ marginRight: 4 }} />
      <div className={styles.buttonSkeleton} style={{ borderRadius: '50%' }} />
    </div>
  </div>
);
