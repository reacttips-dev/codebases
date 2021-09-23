'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
/**
 * A higher-order component to assist with the React 16 migration.
 *
 * In react@15 `connect`ing a functional component was unsupported but failed
 * silently. In react@16, however, this throws an error. This utility serves
 * to temporarily wrap those functional components with classes until either a
 * context-based or hook-based API is available for `general-store`.
 *
 * @param {Function} WrappedComponent - Functional component to wrap
 * @returns {React.Component} Class container for WrappedComponent
 */

function WithClassWrapper(WrappedComponent) {
  var _class, _temp;

  return _temp = _class = /*#__PURE__*/function (_Component) {
    _inherits(ClassWrapper, _Component);

    function ClassWrapper() {
      _classCallCheck(this, ClassWrapper);

      return _possibleConstructorReturn(this, _getPrototypeOf(ClassWrapper).apply(this, arguments));
    }

    _createClass(ClassWrapper, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            children = _this$props.children,
            passthruProps = _objectWithoutProperties(_this$props, ["children"]);

        return /*#__PURE__*/_jsx(WrappedComponent, Object.assign({}, passthruProps, {
          children: children
        }));
      }
    }]);

    return ClassWrapper;
  }(Component), _class.WrappedComponent = WrappedComponent, _temp;
}

export default WithClassWrapper;