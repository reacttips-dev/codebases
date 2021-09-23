'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import { OLAF, THUNDERDOME } from 'HubStyleTokens/colors';
import { HEADING_WEIGHT5 } from 'HubStyleTokens/misc';
import { HEADING5, POPOVER_PADDING_X, POPOVER_PADDING_Y, SHEPHERD_PADDING_Y, TOOLTIP_LONGFORM_PADDING } from 'HubStyleTokens/sizes';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import styled, { css } from 'styled-components';
import { PopoverContext } from '../context/PopoverContext';
import SyntheticEvent from '../core/SyntheticEvent';
import UIPopoverCloseButton from './UIPopoverCloseButton';
var Header = styled.header.withConfig({
  displayName: "UIPopoverHeader__Header",
  componentId: "sc-1dbsx6l-0"
})(["display:flex;justify-content:space-between;align-items:flex-start;background:inherit;border-bottom-left-radius:0;border-bottom-right-radius:0;border-top-left-radius:inherit;border-top-right-radius:inherit;padding:", ";", ";h1,h2,h3,h4,h5,h6{", "}"], function (_ref) {
  var flush = _ref.flush,
      popoverUse = _ref.popoverUse;
  if (flush) return '0';
  if (popoverUse === 'longform') return POPOVER_PADDING_Y + " " + TOOLTIP_LONGFORM_PADDING + " 0";
  if (popoverUse === 'shepherd') return SHEPHERD_PADDING_Y + " " + POPOVER_PADDING_X;
  return POPOVER_PADDING_Y + " " + POPOVER_PADDING_X + " 0";
}, function (_ref2) {
  var popoverUse = _ref2.popoverUse;
  return popoverUse === 'shepherd' && css(["background:", ";border-top-right-radius:inherit;border-top-left-radius:inherit;color:", ";"], THUNDERDOME, OLAF);
}, function (_ref3) {
  var popoverUse = _ref3.popoverUse;
  if (popoverUse === 'longform') return css(["font-size:", ";font-weight:", ";text-transform:none;margin-bottom:8px;"], HEADING5, HEADING_WEIGHT5);
  return 'margin-bottom: 0';
});
export default function UIPopoverHeader(_ref4) {
  var className = _ref4.className,
      children = _ref4.children,
      onOpenChange = _ref4.onOpenChange,
      showCloseButton = _ref4.showCloseButton,
      rest = _objectWithoutProperties(_ref4, ["className", "children", "onOpenChange", "showCloseButton"]);

  var popoverUse = useContext(PopoverContext).use;
  return /*#__PURE__*/_jsxs(Header, Object.assign({}, rest, {
    className: classNames('uiPopoverHeader private-popover__header', className),
    popoverUse: popoverUse,
    children: [children, showCloseButton && /*#__PURE__*/_jsx(UIPopoverCloseButton, {
      popoverUse: popoverUse,
      onClick: function onClick() {
        if (onOpenChange) onOpenChange(SyntheticEvent(false));
      }
    })]
  }));
}
UIPopoverHeader.propTypes = {
  children: PropTypes.node,
  flush: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  onOpenChange: PropTypes.func
};
UIPopoverHeader.displayName = 'UIPopoverHeader';