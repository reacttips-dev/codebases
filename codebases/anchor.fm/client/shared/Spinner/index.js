import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.sass';
import { If } from '../If/index.tsx';
import { Icon } from '../Icon/index.tsx';

const Spinner = ({ size, color, type }) => (
  <If
    condition={type === 'spoke'}
    ifRender={() => (
      <div
        className={styles.spinner}
        style={{
          height: `${size}px`,
          width: `${size}px`,
        }}
      >
        <div
          className={styles.spinnerSpoke}
          style={{ backgroundColor: color }}
        />
        <div
          className={styles.spinnerSpoke}
          style={{ backgroundColor: color }}
        />
        <div
          className={styles.spinnerSpoke}
          style={{ backgroundColor: color }}
        />
        <div
          className={styles.spinnerSpoke}
          style={{ backgroundColor: color }}
        />
        <div
          className={styles.spinnerSpoke}
          style={{ backgroundColor: color }}
        />
        <div
          className={styles.spinnerSpoke}
          style={{ backgroundColor: color }}
        />
        <div
          className={styles.spinnerSpoke}
          style={{ backgroundColor: color }}
        />
        <div
          className={styles.spinnerSpoke}
          style={{ backgroundColor: color }}
        />
        <div
          className={styles.spinnerSpoke}
          style={{ backgroundColor: color }}
        />
        <div
          className={styles.spinnerSpoke}
          style={{ backgroundColor: color }}
        />
        <div
          className={styles.spinnerSpoke}
          style={{ backgroundColor: color }}
        />
        <div
          className={styles.spinnerSpoke}
          style={{ backgroundColor: color }}
        />
      </div>
    )}
    elseRender={() => <Icon type="SpinnerIcon" fillColor={color} />}
  />
);

Spinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(['spoke', 'circle']),
};

Spinner.defaultProps = {
  size: 40,
  color: 'black',
  type: 'spoke',
};

export const CenteredSpinner = props => (
  <div className={styles.centered}>
    <Spinner {...props} />
  </div>
);

export { Spinner as default, Spinner };
