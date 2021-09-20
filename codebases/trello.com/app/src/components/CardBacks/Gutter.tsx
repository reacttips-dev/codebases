import React from 'react';
import styles from './Gutter.less';

export const Gutter: React.FC = ({ children }) => {
  return <div className={styles.gutter}>{children}</div>;
};
