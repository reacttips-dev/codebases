'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { alignPropType } from './TablePropTypes';
import { isIE11 } from '../../utils/BrowserTest';
import { TABLE_HEADER_HEIGHT } from 'HubStyleTokens/sizes'; // In IE11, the height grows uncontrollably if not set to a fixed value.

var fixedHeightMixin = css(["height:", ";"], TABLE_HEADER_HEIGHT);
var StyledContent = styled.div.withConfig({
  displayName: "SortTH_Content__StyledContent",
  componentId: "sc-1ace91e-0"
})(["align-items:center;display:flex;margin-left:", ";text-align:", ";", ";"], function (_ref) {
  var align = _ref.align;
  return align === 'right' && 'auto';
}, function (_ref2) {
  var align = _ref2.align;
  return align === 'right' && 'right';
}, isIE11() ? fixedHeightMixin : null);

var SortTH_Content = function SortTH_Content(_ref3) {
  var align = _ref3.align,
      arrowsNode = _ref3.arrowsNode,
      children = _ref3.children;
  return /*#__PURE__*/_jsxs(StyledContent, {
    align: align,
    children: [children, arrowsNode]
  });
};

SortTH_Content.propTypes = {
  align: alignPropType,
  arrowsNode: PropTypes.node,
  children: PropTypes.node
};
SortTH_Content.displayName = 'UISortTH_Content';
export default SortTH_Content;