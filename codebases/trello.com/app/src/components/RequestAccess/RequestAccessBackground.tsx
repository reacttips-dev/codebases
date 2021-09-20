import React from 'react';
import styles from './RequestAccessBackground.less';

export const RequestAccessBackground = () => (
  <div className={styles.background}>
    <img
      alt=""
      className={styles.left}
      src={require('resources/images/request-access/background-left.svg')}
    />
    <img
      alt=""
      className={styles.right}
      src={require('resources/images/request-access/background-right.svg')}
    />
  </div>
);
