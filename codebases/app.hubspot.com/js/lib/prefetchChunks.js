'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
export default (function (fetchers) {
  return function (WrappedComponent) {
    return /*#__PURE__*/function (_Component) {
      _inherits(Prefetch, _Component);

      function Prefetch() {
        _classCallCheck(this, Prefetch);

        return _possibleConstructorReturn(this, _getPrototypeOf(Prefetch).apply(this, arguments));
      }

      _createClass(Prefetch, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          var _this = this;

          this.interval = setInterval(function () {
            if (document.readyState === 'complete') {
              fetchers.forEach(function (fetcher) {
                return fetcher();
              });
              clearInterval(_this.interval);
              _this.interval = null;
            }
          }, 250);
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          if (this.interval) clearInterval(this.interval);
        }
      }, {
        key: "render",
        value: function render() {
          return /*#__PURE__*/_jsx(WrappedComponent, Object.assign({}, this.props));
        }
      }]);

      return Prefetch;
    }(Component);
  };
});