import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import cx from 'classnames';
import autobind from 'class-autobind';

import styles from './Button.css';

var Button = function (_Component) {
  _inherits(Button, _Component);

  function Button() {
    _classCallCheck(this, Button);

    var _this = _possibleConstructorReturn(this, (Button.__proto__ || _Object$getPrototypeOf(Button)).apply(this, arguments));

    autobind(_this);
    return _this;
  }

  _createClass(Button, [{
    key: 'render',
    value: function render() {
      var props = this.props;

      var className = props.className,
          isDisabled = props.isDisabled,
          focusOnClick = props.focusOnClick,
          formSubmit = props.formSubmit,
          otherProps = _objectWithoutProperties(props, ['className', 'isDisabled', 'focusOnClick', 'formSubmit']);

      className = cx(className, styles.root);
      var onMouseDown = focusOnClick === false ? this._onMouseDownPreventDefault : props.onMouseDown;
      var type = formSubmit ? 'submit' : 'button';
      return React.createElement(
        'button',
        _extends({ type: type }, otherProps, { onMouseDown: onMouseDown, className: className, disabled: isDisabled }),
        props.children
      );
    }
  }, {
    key: '_onMouseDownPreventDefault',
    value: function _onMouseDownPreventDefault(event) {
      event.preventDefault();
      var onMouseDown = this.props.onMouseDown;

      if (onMouseDown != null) {
        onMouseDown(event);
      }
    }
  }]);

  return Button;
}(Component);

export default Button;