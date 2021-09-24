'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
var DRAFT_EVENTS = ['onBeforeInput', 'onBlur', 'onClick', 'onCompositionEnd', 'onCompositionStart', 'onCopy', 'onCut', 'onDragEnd', 'onDragEnter', 'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop', 'onFocus', 'onInput', 'onKeyDown', 'onKeyPress', 'onKeyUp', 'onMouseDown', 'onMouseUp', 'onPaste', 'onSelect'];
export default (function (Component) {
  var EventBoundary = /*#__PURE__*/function (_React$Component) {
    _inherits(EventBoundary, _React$Component);

    function EventBoundary(props) {
      var _this;

      _classCallCheck(this, EventBoundary);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(EventBoundary).call(this, props));
      _this.handlers = DRAFT_EVENTS.reduce(function (acc, eventName) {
        acc[eventName] = function (e) {
          if (e && e.stopPropagation) {
            e.stopPropagation();
          }

          if (_this.props[eventName]) {
            _this.props[eventName](e);
          }
        };

        return acc;
      }, {});
      return _this;
    }

    _createClass(EventBoundary, [{
      key: "render",
      value: function render() {
        return /*#__PURE__*/_jsx(Component, Object.assign({}, this.props, {}, this.handlers));
      }
    }]);

    return EventBoundary;
  }(React.Component);

  EventBoundary.propTypes = Object.assign({}, Component.propTypes);
  EventBoundary.defaultProps = Object.assign({}, Component.defaultProps);
  return EventBoundary;
});