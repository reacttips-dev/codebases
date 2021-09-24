'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import { POPOVER_PADDING_X, POPOVER_PADDING_Y, SHEPHERD_PADDING_Y, TOOLTIP_LONGFORM_PADDING, TOOLTIP_PADDING_X, TOOLTIP_PADDING_Y } from 'HubStyleTokens/sizes';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import styled, { css } from 'styled-components';
import { PopoverContext } from '../context/PopoverContext';
var Body = styled.div.withConfig({
  displayName: "UIPopoverBody__Body",
  componentId: "vzza89-0"
})(["background:inherit;padding:", ";", ";"], function (_ref) {
  var flush = _ref.flush,
      popoverUse = _ref.popoverUse;
  if (flush) return '0';
  if (popoverUse === 'longform') return "0 " + TOOLTIP_LONGFORM_PADDING + " 1px";
  if (popoverUse === 'shepherd') return SHEPHERD_PADDING_Y + " " + POPOVER_PADDING_X;
  if (popoverUse.includes('tooltip')) return TOOLTIP_PADDING_Y + " " + TOOLTIP_PADDING_X;
  return POPOVER_PADDING_Y + " " + POPOVER_PADDING_X + " 0";
}, function (_ref2) {
  var popoverUse = _ref2.popoverUse;
  if (popoverUse === 'shepherd') return css(["border-bottom-left-radius:inherit;border-bottom-right-radius:inherit;"]);
  if (popoverUse.includes('tooltip')) return css(["border-radius:inherit;line-height:1.5;"]);
  return null;
});
export default function UIPopoverBody(_ref3) {
  var className = _ref3.className,
      rest = _objectWithoutProperties(_ref3, ["className"]);

  return /*#__PURE__*/_jsx(Body, Object.assign({}, rest, {
    className: classNames('uiPopoverBody private-popover__body', className),
    popoverUse: useContext(PopoverContext).use
  }));
}
UIPopoverBody.propTypes = {
  children: PropTypes.node,
  flush: PropTypes.bool
};
UIPopoverBody.displayName = 'UIPopoverBody';