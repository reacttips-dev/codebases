import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import IconButton from '../ui/IconButton';
import autobind from 'class-autobind';

var StyleButton = function (_Component) {
  _inherits(StyleButton, _Component);

  function StyleButton() {
    _classCallCheck(this, StyleButton);

    var _this = _possibleConstructorReturn(this, (StyleButton.__proto__ || _Object$getPrototypeOf(StyleButton)).apply(this, arguments));

    autobind(_this);
    return _this;
  }

  _createClass(StyleButton, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          style = _props.style,
          onToggle = _props.onToggle,
          otherProps = _objectWithoutProperties(_props, ['style', 'onToggle']); // eslint-disable-line no-unused-vars


      var iconName = style.toLowerCase();
      // `focusOnClick` will prevent the editor from losing focus when a control
      // button is clicked.
      return React.createElement(IconButton, _extends({}, otherProps, {
        iconName: iconName,
        onClick: this._onClick,
        focusOnClick: false
      }));
    }
  }, {
    key: '_onClick',
    value: function _onClick() {
      this.props.onToggle(this.props.style);
    }
  }]);

  return StyleButton;
}(Component);

export default StyleButton;