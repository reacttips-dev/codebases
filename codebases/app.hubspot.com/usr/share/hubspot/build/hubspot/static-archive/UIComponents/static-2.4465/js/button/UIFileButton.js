'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component, Fragment } from 'react';
import { USE_CLASSES } from './ButtonConstants';
import UIButton from './UIButton';

var UIFileButton = /*#__PURE__*/function (_Component) {
  _inherits(UIFileButton, _Component);

  function UIFileButton() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIFileButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIFileButton)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleClick = function (evt) {
      var onClick = _this.props.onClick;

      _this._file.click();

      if (onClick) onClick(evt);
    };

    _this.fileRefCallback = function (ref) {
      _this._file = ref;
    };

    return _this;
  }

  _createClass(UIFileButton, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          accept = _this$props.accept,
          Button = _this$props.Button,
          children = _this$props.children,
          id = _this$props.id,
          multiple = _this$props.multiple,
          onChange = _this$props.onChange,
          __onClick = _this$props.onClick,
          rest = _objectWithoutProperties(_this$props, ["accept", "Button", "children", "id", "multiple", "onChange", "onClick"]);

      return /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx(Button, Object.assign({
          className: "private-file-button",
          "data-component-name": "UIFileButton",
          onClick: this.handleClick
        }, rest, {
          children: children
        })), /*#__PURE__*/_jsx("input", {
          className: "private-file-button__input hidden",
          id: id,
          ref: this.fileRefCallback,
          type: "file",
          accept: accept.join(','),
          multiple: multiple,
          onChange: onChange
        })]
      });
    }
  }]);

  return UIFileButton;
}(Component);

export { UIFileButton as default };
UIFileButton.propTypes = {
  accept: PropTypes.array.isRequired,
  Button: PropTypes.elementType.isRequired,
  children: PropTypes.node.isRequired,
  multiple: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  use: PropTypes.oneOf(Object.keys(USE_CLASSES)).isRequired
};
UIFileButton.defaultProps = {
  accept: [],
  Button: UIButton,
  multiple: false,
  use: 'tertiary-light'
};
UIFileButton.displayName = 'UIFileButton';