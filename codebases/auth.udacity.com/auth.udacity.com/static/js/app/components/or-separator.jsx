import React from 'react';
import { __ } from '../../services/localization-service';
import styles from './or-separator.module.scss';

export default function OrSeparator() {
  return (
    <div className={styles.contain}>
      <div className={styles.flex}>
        <hr className={styles.line} />
        <div className={styles.text}>{__('or')}</div>
        <hr className={styles.line} />
      </div>
    </div>
  );
}
