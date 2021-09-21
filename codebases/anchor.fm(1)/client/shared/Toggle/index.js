import React from 'react';
import PropTypes from 'prop-types';
import ReactToggle from 'react-toggle';
import classnames from 'classnames/bind';
import styles from './Toggle.sass';

const cx = classnames.bind(styles);

const noop = () => null;

const supportedColors = ['purple', 'green'];
const Toggle = ({ isChecked, onToggle, isDisabled, className, color }) => (
  <ReactToggle
    aria-labelledby="instantPayoutLabel"
    icons={false}
    checked={isChecked}
    onChange={evt => {
      onToggle(evt.target.checked);
    }}
    className={cx({
      root: true,
      [className]: Boolean(className),
      green: color === 'green',
      purple: color === 'purple' || !supportedColors.includes(color),
    })}
    disabled={isDisabled}
  />
);

Toggle.defaultProps = {
  isChecked: false,
  onToggle: noop,
  isDisabled: false,
  className: '',
  color: 'purple',
};

Toggle.propTypes = {
  isChecked: PropTypes.bool,
  onToggle: PropTypes.func,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
  color: PropTypes.oneOf(['purple', 'green']),
};

export default Toggle;
