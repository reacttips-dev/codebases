'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import UIMain from '../layout/UIMain';
import * as CustomRenderer from '../utils/propTypes/customRenderer';
import { GRID_BREAKPOINT_SMALL, NAV_ITEM_PADDING_LEFT } from 'HubStyleTokens/sizes';
var GRID_GUTTER_WIDTH_HALF = '16px';
var SIDEBAR_FULL_WIDTH = '256px';
var SIDEBAR_INNER_WIDTH = '224px';
var Outer = styled.div.withConfig({
  displayName: "UIAbstractPageGridContent__Outer",
  componentId: "sc-1vq53qe-0"
})(["display:flex;flex-wrap:nowrap;margin-left:", ";margin-right:", ";@media only screen and (max-width:", "){flex-wrap:wrap;}"], function (_ref) {
  var flush = _ref.flush;
  return !flush && "-" + GRID_GUTTER_WIDTH_HALF;
}, function (_ref2) {
  var flush = _ref2.flush;
  return !flush && "-" + GRID_GUTTER_WIDTH_HALF;
}, GRID_BREAKPOINT_SMALL);
var Sidebar = styled.div.withConfig({
  displayName: "UIAbstractPageGridContent__Sidebar",
  componentId: "sc-1vq53qe-1"
})(["flex:0 0 33%;max-width:", ";padding-left:", ";padding-right:", ";position:relative;", ";@media only screen and (max-width:", "){flex-basis:100%;max-width:none;}"], function (_ref3) {
  var flush = _ref3.flush;
  return flush ? SIDEBAR_FULL_WIDTH : SIDEBAR_INNER_WIDTH;
}, function (_ref4) {
  var flush = _ref4.flush;
  return !flush && GRID_GUTTER_WIDTH_HALF;
}, function (_ref5) {
  var flush = _ref5.flush;
  return !flush && GRID_GUTTER_WIDTH_HALF;
}, function (_ref6) {
  var sidebarStyle = _ref6.sidebarStyle;
  return sidebarStyle;
}, GRID_BREAKPOINT_SMALL);
var MainContainer = styled.div.withConfig({
  displayName: "UIAbstractPageGridContent__MainContainer",
  componentId: "sc-1vq53qe-2"
})(["flex:1 0 0%;max-width:", ";padding-left:", ";padding-right:", ";position:relative;@media only screen and (max-width:679px){max-width:", ";}@media only screen and (max-width:", "){flex-basis:100%;max-width:100%;}"], function (_ref7) {
  var hasSidebar = _ref7.hasSidebar,
      flushSidebar = _ref7.flushSidebar;
  return hasSidebar ? "calc(100% - " + (flushSidebar ? SIDEBAR_FULL_WIDTH : SIDEBAR_INNER_WIDTH) + ")" : '100%';
}, GRID_GUTTER_WIDTH_HALF, GRID_GUTTER_WIDTH_HALF, function (_ref8) {
  var hasSidebar = _ref8.hasSidebar;
  return hasSidebar && '67%';
}, GRID_BREAKPOINT_SMALL);
var STICKY_STYLES = css(["max-height:100vh;margin-left:-", ";overflow-y:auto;padding-left:", ";position:sticky;top:0;@media only screen and (max-width:", "){height:auto;}"], NAV_ITEM_PADDING_LEFT, NAV_ITEM_PADDING_LEFT, GRID_BREAKPOINT_SMALL);
var SidebarContainer = styled.div.withConfig({
  displayName: "UIAbstractPageGridContent__SidebarContainer",
  componentId: "sc-1vq53qe-3"
})(["", ";"], function (props) {
  return props.stickySidebar && STICKY_STYLES;
});
export default function UIAbstractPageGridContent(props) {
  var children = props.children,
      sidebarAreaFlush = props.sidebarAreaFlush,
      sidebarComponent = props.sidebarComponent,
      sidebarStyle = props.sidebarStyle,
      stickySidebar = props.stickySidebar;
  return /*#__PURE__*/_jsxs(Outer, {
    flush: sidebarAreaFlush,
    children: [sidebarComponent && /*#__PURE__*/_jsx(Sidebar, {
      flush: sidebarAreaFlush,
      sidebarStyle: sidebarStyle,
      children: /*#__PURE__*/_jsx(SidebarContainer, {
        stickySidebar: stickySidebar,
        children: CustomRenderer.render(sidebarComponent)
      })
    }), /*#__PURE__*/_jsx(MainContainer, {
      hasSidebar: !!sidebarComponent,
      flushSidebar: sidebarAreaFlush,
      children: /*#__PURE__*/_jsx(UIMain, {
        flush: true,
        children: children
      })
    })]
  });
}
UIAbstractPageGridContent.propTypes = {
  children: PropTypes.node,
  sidebarComponent: CustomRenderer.propType,
  sidebarAreaFlush: PropTypes.bool.isRequired,
  sidebarStyle: PropTypes.object,
  stickySidebar: PropTypes.bool
};
UIAbstractPageGridContent.defaultProps = {
  sidebarAreaFlush: false,
  stickySidebar: false
};
UIAbstractPageGridContent.displayName = 'UIAbstractPageGridContent';