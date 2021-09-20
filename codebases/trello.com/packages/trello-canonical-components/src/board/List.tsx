import React from 'react';
import styles from './Board.less';

export const List: React.FC = ({ children }) => (
  <div className={styles.list}>{children}</div>
);
