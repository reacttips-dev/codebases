'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
var SCROLLBAR_SPACE = 24;
var ScrollWrapper = styled.div.withConfig({
  displayName: "HiddenHorizontalScroll__ScrollWrapper",
  componentId: "sc-1brmv18-0"
})(["height:", "px;overflow-y:hidden;"], function (props) {
  return props.height;
});
var ScrollInner = styled.div.withConfig({
  displayName: "HiddenHorizontalScroll__ScrollInner",
  componentId: "sc-1brmv18-1"
})(["height:", "px;overflow-x:auto;"], function (props) {
  return props.height;
});
export default function HiddenHorizontalScroll(_ref) {
  var children = _ref.children,
      visibleHeight = _ref.visibleHeight;
  return /*#__PURE__*/_jsx(ScrollWrapper, {
    height: visibleHeight,
    children: /*#__PURE__*/_jsx(ScrollInner, {
      height: visibleHeight + SCROLLBAR_SPACE,
      children: children
    })
  });
}