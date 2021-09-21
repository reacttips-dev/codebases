import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
import cx from 'classnames';

import styles from './ButtonWrap.css';

export default function ButtonWrap(props) {
  var className = cx(props.className, styles.root);
  return React.createElement('div', _extends({}, props, { className: className }));
}