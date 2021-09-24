'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Component } from 'react';
/**
 * A class-component that just renders its `children`. Can be used with
 * `findDOMNode` in order to obtain a reference to the `children`'s DOM node.
 *
 * This is mostly useful when:
 * 1. a function component needs to use `findDOMNode(this)` but can't because
 *    it doesn't have a backing instance
 * 2. a component needs to call `findDOMNode` on an element it renders *but
 *    does not define* without using `cloneElement` to attach a ref to the
 *    element
 */

var ChildrenWrapper = /*#__PURE__*/function (_Component) {
  _inherits(ChildrenWrapper, _Component);

  function ChildrenWrapper() {
    _classCallCheck(this, ChildrenWrapper);

    return _possibleConstructorReturn(this, _getPrototypeOf(ChildrenWrapper).apply(this, arguments));
  }

  _createClass(ChildrenWrapper, [{
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);

  return ChildrenWrapper;
}(Component);

export { ChildrenWrapper as default };