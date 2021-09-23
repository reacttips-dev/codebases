import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.sass';

const Caret = ({ className, color }) => (
  <div
    className={`${styles.caret} ${className || ''}`}
    style={{ borderTopColor: color }}
  />
);

Caret.defaultProps = { className: null, color: null };

Caret.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
};
export { Caret };
