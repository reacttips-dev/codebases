'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import omit from '../utils/underscore/omit';
import UIAbstractPageTemplate from './UIAbstractPageTemplate';
import { GYPSUM, SLINKY, TRANSPARENT } from 'HubStyleTokens/colors';
import { rgba } from '../core/Color';
import { GRID_BREAKPOINT_SMALL, GRID_BREAKPOINT_MEDIUM } from 'HubStyleTokens/sizes';
import lazyEval from '../utils/lazyEval';
import { getDefaultNavHeight } from '../utils/NavHeight';
import { toPx } from '../utils/Styles';
var BLUR_RADIUS = '3px';
var Sidebar = styled.div.withConfig({
  displayName: "UISidebarPage__Sidebar",
  componentId: "tjq81d-0"
})(["padding-top:20px;padding-right:32px;padding-left:32px;overflow-y:auto;"]);
var Main = styled.div.withConfig({
  displayName: "UISidebarPage__Main",
  componentId: "tjq81d-1"
})(["padding:20px 16px;@media only screen and (max-width:", "){padding-right:8px;padding-left:8px;}@media only screen and (max-width:", "){padding-right:0;padding-left:0;}"], GRID_BREAKPOINT_MEDIUM, GRID_BREAKPOINT_SMALL);

function UISidebarPage(props) {
  var children = props.children,
      sidebarBackgroundColor = props.sidebarBackgroundColor,
      sidebarComponent = props.sidebarComponent,
      rest = _objectWithoutProperties(props, ["children", "sidebarBackgroundColor", "sidebarComponent"]);

  var sidebarContent = /*#__PURE__*/_jsx(Sidebar, {
    children: sidebarComponent
  });

  var mainContent = /*#__PURE__*/_jsx(Main, {
    children: children
  });

  var sidebarStyle = {
    backgroundColor: sidebarBackgroundColor,
    minHeight: "calc(100vh - " + toPx(lazyEval(getDefaultNavHeight)) + ")"
  };

  if (sidebarBackgroundColor !== TRANSPARENT) {
    // Add vertical divider between sidebar and main content
    Object.assign(sidebarStyle, _defineProperty({
      boxShadow: "1px 0 " + BLUR_RADIUS + " 0 " + rgba(SLINKY, 0.25),
      marginRight: BLUR_RADIUS
    }, "@media only screen and (max-width: " + GRID_BREAKPOINT_SMALL + ")", {
      boxShadow: 'none',
      marginRight: 0
    }));
  }

  return /*#__PURE__*/_jsx(UIAbstractPageTemplate, Object.assign({
    contentAreaFlush: true,
    sidebarAreaFlush: true,
    sidebarComponent: sidebarContent,
    pageLayout: "full-width",
    stickySidebar: true,
    sidebarStyle: sidebarStyle
  }, rest, {
    children: mainContent
  }));
}

UISidebarPage.propTypes = Object.assign({}, omit(UIAbstractPageTemplate.propTypes, ['contentAreaFlush', 'pageLayout', 'sidebarAreaFlush', 'stickySidebar']), {
  children: PropTypes.node,
  sidebarBackgroundColor: PropTypes.string
});
UISidebarPage.defaultProps = Object.assign({}, omit(UIAbstractPageTemplate.defaultProps, ['contentAreaFlush', 'pageLayout', 'sidebarAreaFlush', 'stickySidebar', 'headerComponent']), {
  sidebarBackgroundColor: GYPSUM,
  headerComponent: null
});
UISidebarPage.displayName = 'UISidebarPage';
export default UISidebarPage;