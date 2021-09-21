import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import cx from 'classnames';
import Button from './Button';
import ButtonWrap from './ButtonWrap';

import styles from './IconButton.css';

var IconButton = function (_Component) {
  _inherits(IconButton, _Component);

  function IconButton() {
    _classCallCheck(this, IconButton);

    return _possibleConstructorReturn(this, (IconButton.__proto__ || _Object$getPrototypeOf(IconButton)).apply(this, arguments));
  }

  _createClass(IconButton, [{
    key: 'render',
    value: function render() {
      var _cx;

      var props = this.props;

      var className = props.className,
          iconName = props.iconName,
          label = props.label,
          children = props.children,
          isActive = props.isActive,
          otherProps = _objectWithoutProperties(props, ['className', 'iconName', 'label', 'children', 'isActive']);

      className = cx(className, (_cx = {}, _defineProperty(_cx, styles.root, true), _defineProperty(_cx, styles.isActive, isActive), _cx));
      return React.createElement(
        ButtonWrap,
        null,
        React.createElement(
          Button,
          _extends({}, otherProps, { title: label, className: className }),
          React.createElement('span', { className: styles['icon-' + iconName] })
        ),
        children
      );
    }
  }]);

  return IconButton;
}(Component);

export default IconButton;