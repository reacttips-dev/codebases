'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import UITag from '../../tag/UITag';
import SyntheticEvent from '../../core/SyntheticEvent';

var MultiSelectValue = /*#__PURE__*/function (_Component) {
  _inherits(MultiSelectValue, _Component);

  function MultiSelectValue() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, MultiSelectValue);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MultiSelectValue)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleMouseDown = function (evt) {
      var _this$props = _this.props,
          onClick = _this$props.onClick,
          value = _this$props.value;

      if (evt.type === 'mousedown' && evt.button !== 0) {
        return;
      }

      if (onClick) {
        evt.stopPropagation();
        onClick(SyntheticEvent(value));
      }
    };

    _this.handleCloseMouseDown = function (evt) {
      var _this$props2 = _this.props,
          onRemove = _this$props2.onRemove,
          value = _this$props2.value;
      onRemove(value); // Prevent input focus, which leads to scroll jank (#1724)

      evt.preventDefault();
      evt.stopPropagation();
    };

    return _this;
  }

  _createClass(MultiSelectValue, [{
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          children = _this$props3.children,
          closeable = _this$props3.closeable,
          disabled = _this$props3.disabled,
          value = _this$props3.value;
      var computedUse = value.tagUse || 'default';
      return /*#__PURE__*/_jsx(UITag, {
        _onCloseMouseDown: this.handleCloseMouseDown,
        _bordered: true,
        closeable: typeof closeable === 'boolean' ? closeable : !disabled && value.clearableValue !== false,
        onMouseDown: this.handleMouseDown,
        onTouchEnd: this.handleMouseDown,
        use: computedUse,
        children: children
      });
    }
  }]);

  return MultiSelectValue;
}(Component);

export { MultiSelectValue as default };
MultiSelectValue.propTypes = {
  children: PropTypes.node,
  closeable: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onRemove: PropTypes.func,
  value: PropTypes.object
};
MultiSelectValue.displayName = 'MultiSelectValue';