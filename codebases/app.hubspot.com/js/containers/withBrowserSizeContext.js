'use es6';
/* eslint-disable react/display-name */

import { jsx as _jsx } from "react/jsx-runtime";
import { BrowserWindowContext } from '../components/BrowserWindowContext';
export var withBrowserSizeContext = function withBrowserSizeContext(Component) {
  return function (props) {
    return /*#__PURE__*/_jsx(BrowserWindowContext.Consumer, {
      children: function children(_ref) {
        var browserWindowHeight = _ref.browserWindowHeight,
            browserWindowWidth = _ref.browserWindowWidth;
        return /*#__PURE__*/_jsx(Component, Object.assign({}, props, {
          browserWindowHeight: browserWindowHeight,
          browserWindowWidth: browserWindowWidth
        }));
      }
    });
  };
};