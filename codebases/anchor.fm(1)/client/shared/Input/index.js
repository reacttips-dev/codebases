import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './Input.sass';

const cx = classnames.bind(styles);
const noop = () => null;

const getRadiusPixelsForShape = shape => {
  switch (shape) {
    case 'pill':
      return 23;
    case 'rounded':
      return 4;
    case 'square':
    default:
      return 0;
  }
};

/**
 * @deprecated Use the `Field*` components instead
 */
class Input extends Component {
  constructor(props) {
    super(props);
    this.inputDomRef = null;
  }

  setFocusOnInput = () => {
    this.inputDomRef.focus();
  };

  render() {
    const {
      onEnter,
      onChange,
      onBlur,
      onFocus,
      className,
      prependClassName,
      appendClassName,
      placeholder,
      maxChars,
      value,
      renderPrepend,
      renderAppend,
      backgroundColor,
      shape,
      type,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      fontSize,
      isRequired,
    } = this.props;
    return (
      <div
        className={cx({
          root: true,
          [className]: true,
        })}
        style={{
          backgroundColor,
          borderRadius: getRadiusPixelsForShape(shape),
          paddingLeft,
          paddingRight,
          paddingTop,
          paddingBottom,
        }}
      >
        <div
          className={cx({
            prependContainer: true,
            [prependClassName]: true,
          })}
          onClick={this.setFocusOnInput}
        >
          {renderPrepend()}
        </div>
        <input
          isRequired={isRequired}
          className={styles.textarea}
          type={type}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={e => {
            e.persist();
            if (e.keyCode === 13) {
              onEnter(e);
            }
          }}
          onChange={evt => {
            onChange(evt.target.value);
          }}
          placeholder={placeholder}
          maxLength={maxChars}
          value={value}
          style={{
            fontSize,
          }}
          ref={input => {
            this.inputDomRef = input;
          }}
        />
        <div
          className={cx({
            appendContainer: true,
            [appendClassName]: true,
          })}
          onClick={this.setFocusOnInput}
        >
          {renderAppend()}
        </div>
      </div>
    );
  }
}

Input.defaultProps = {
  onEnter: noop,
  onChange: noop,
  onBlur: noop,
  onFocus: noop,
  className: '',
  prependClassName: '',
  appendClassName: '',
  placeholder: '',
  maxChars: 1000,
  renderPrepend: noop,
  renderAppend: noop,
  backgroundColor: 'white',
  shape: 'square',
  type: 'text',
  paddingLeft: 12,
  paddingRight: 12,
  paddingTop: 10.3,
  paddingBottom: 10.3,
  fontSize: 14,
  isRequired: false,
};

Input.propTypes = {
  isRequired: PropTypes.bool,
  onEnter: PropTypes.func,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  renderPrepend: PropTypes.func,
  renderAppend: PropTypes.func,
  className: PropTypes.string,
  prependClassName: PropTypes.string,
  appendClassName: PropTypes.string,
  placeholder: PropTypes.string,
  maxChars: PropTypes.number,
  value: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  shape: PropTypes.oneOf(['square', 'rounded', 'pill']),
  type: PropTypes.oneOf(['text', 'password']),
  paddingLeft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paddingRight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paddingTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paddingBottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

// eslint-disable-next-line import/no-default-export
export default Input;
