import React from 'react';
import styles from './styles.sass';

const Spinner = ({ size = 40, color = 'white', style = {} }) => (
  <div
    className={`${styles.spinner} ${styles[color]}`}
    style={{
      height: `${size}px`,
      width: `${size}px`,
      ...style,
    }}
  >
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
);

/**
 * @deprecated Use the `Spinner` in ./client/shared/Spinner/index.js
 */
export const CenteredSpinner = props => (
  <div className={styles.centered}>
    <Spinner {...props} />
  </div>
);

// eslint-disable-next-line import/no-default-export
export default Spinner;
