import React from 'react';
import styles from './styles.sass';

// HOC for AMP page rendering
const AMPPageHeader = ({ title, subtitle = '' }) => (
  <div className={styles.header}>
    <div className={styles.aligned}>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
    </div>
  </div>
);

export default AMPPageHeader;
