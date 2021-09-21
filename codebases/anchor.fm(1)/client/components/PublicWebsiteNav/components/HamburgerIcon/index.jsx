import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.sass';

const HamburgerIcon = ({ onClick }) => (
  <button type="button" className={styles.wrapper} onClick={onClick}>
    <div className={styles.lineContainer}>
      <span className={styles.line} />
      <span className={styles.line} />
      <span className={styles.line} />
    </div>
  </button>
);

HamburgerIcon.defaultProps = {
  onClick: () => {},
};
HamburgerIcon.propTypes = {
  onClick: PropTypes.func,
};

export { HamburgerIcon };
