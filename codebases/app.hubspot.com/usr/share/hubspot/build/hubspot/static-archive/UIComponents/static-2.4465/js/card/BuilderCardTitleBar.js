'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useState } from 'react';
import styled from 'styled-components';
import { OBSIDIAN } from 'HubStyleTokens/colors';
import { BUILDER_CARD_TITLE_BAR_USES, BUILDER_CARD_BORDER_COLOR_DEFAULT } from './BuilderCardConstants';
import { titlebarColorTheme } from './BuilderCardUtils';
import UITruncateString from '../text/UITruncateString';
import useHovered from '../hooks/useHovered';
var Wrapper = styled.div.withConfig({
  displayName: "BuilderCardTitleBar__Wrapper",
  componentId: "op6271-0"
})(["align-items:center;color:", ";display:flex;padding:5px 10px;position:relative;justify-content:space-between;", ";&::after{display:", ";content:'';border-bottom:1px solid ", ";bottom:0;left:0;position:absolute;width:100%;}"], OBSIDIAN, function (props) {
  return titlebarColorTheme(props.use);
}, function (props) {
  return props.use === 'heffalump' ? 'none' : null;
}, BUILDER_CARD_BORDER_COLOR_DEFAULT);
var IconWrapper = styled.span.withConfig({
  displayName: "BuilderCardTitleBar__IconWrapper",
  componentId: "op6271-1"
})(["margin-right:6px;"]);
var ActionWrapper = styled.div.withConfig({
  displayName: "BuilderCardTitleBar__ActionWrapper",
  componentId: "op6271-2"
})(["margin-left:16px;"]);
var StyledTruncateString = styled(UITruncateString).withConfig({
  displayName: "BuilderCardTitleBar__StyledTruncateString",
  componentId: "op6271-3"
})(["min-width:0;justify-content:space-between;"]);
export default function BuilderCardTitleBar(_ref) {
  var action = _ref.action,
      children = _ref.children,
      icon = _ref.icon,
      rest = _objectWithoutProperties(_ref, ["action", "children", "icon"]);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      truncateStringIsOpen = _useState2[0],
      setTruncateStringIsOpen = _useState2[1];

  var _useHovered = useHovered({}),
      actionWrapperIsHovered = _useHovered.hovered,
      actionWrapperHoverHandlers = _objectWithoutProperties(_useHovered, ["hovered"]);

  return /*#__PURE__*/_jsxs(Wrapper, Object.assign({
    icon: icon
  }, rest, {
    children: [icon != null ? /*#__PURE__*/_jsx(IconWrapper, {
      children: icon
    }) : null, /*#__PURE__*/_jsx(StyledTruncateString, {
      open: !actionWrapperIsHovered && truncateStringIsOpen,
      onOpenChange: function onOpenChange(evt) {
        setTruncateStringIsOpen(evt.target.value);
      },
      useFlex: true,
      fixedChildren: action && /*#__PURE__*/_jsx(ActionWrapper, Object.assign({}, actionWrapperHoverHandlers, {
        children: action
      })),
      children: children
    })]
  }));
}
BuilderCardTitleBar.propTypes = {
  action: PropTypes.node,
  children: PropTypes.node,
  icon: PropTypes.node,
  use: PropTypes.oneOf(BUILDER_CARD_TITLE_BAR_USES)
};
BuilderCardTitleBar.defaultProps = {
  use: 'heffalump'
};
BuilderCardTitleBar.displayName = 'BuilderCardTitleBar';