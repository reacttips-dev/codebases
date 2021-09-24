import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { Component } from 'react';
import NavMarker from '../NavMarker';

var RhumbGlobalErrorBoundary = /*#__PURE__*/function (_Component) {
  _inherits(RhumbGlobalErrorBoundary, _Component);

  function RhumbGlobalErrorBoundary() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, RhumbGlobalErrorBoundary);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RhumbGlobalErrorBoundary)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {};
    return _this;
  }

  _createClass(RhumbGlobalErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error) {
      this.props.onError(error);
    }
  }, {
    key: "render",
    value: function render() {
      return this.state.error ? /*#__PURE__*/_jsx(NavMarker, {
        name: "RHUMB_GLOBAL_ERROR_BOUNDARY"
      }) : this.props.children;
    }
  }], [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError(error) {
      return {
        error: error
      };
    }
  }]);

  return RhumbGlobalErrorBoundary;
}(Component);

export default RhumbGlobalErrorBoundary;