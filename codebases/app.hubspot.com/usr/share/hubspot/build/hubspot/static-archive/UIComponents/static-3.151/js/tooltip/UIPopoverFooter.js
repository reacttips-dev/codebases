'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import { POPOVER_PADDING_X, POPOVER_PADDING_Y, SHEPHERD_PADDING_Y, TOOLTIP_LONGFORM_PADDING } from 'HubStyleTokens/sizes';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import styled, { css } from 'styled-components';
import { PopoverContext } from '../context/PopoverContext';
import { toPx } from '../utils/Styles';

var handlePadding = function handlePadding(hasStructuredFooter, popoverUse) {
  if (popoverUse === 'longform') return "0 " + TOOLTIP_LONGFORM_PADDING + " " + POPOVER_PADDING_Y;

  if (popoverUse === 'shepherd') {
    var paddingTop = hasStructuredFooter ? toPx(parseInt(POPOVER_PADDING_X, 10) - parseInt(SHEPHERD_PADDING_Y, 10)) : '0px';
    var paddingBottom = hasStructuredFooter ? POPOVER_PADDING_Y : SHEPHERD_PADDING_Y;
    return paddingTop + " " + POPOVER_PADDING_X + " " + paddingBottom + " " + POPOVER_PADDING_X;
  }

  return POPOVER_PADDING_Y + " " + POPOVER_PADDING_X;
};

var Footer = styled.footer.withConfig({
  displayName: "UIPopoverFooter__Footer",
  componentId: "sc-1ifv5ld-0"
})(["background:inherit;border-radius:inherit;border-top-left-radius:0;border-top-right-radius:0;padding:", ";text-align:", ";", ";"], function (_ref) {
  var flush = _ref.flush,
      hasStructuredFooter = _ref.hasStructuredFooter,
      popoverUse = _ref.popoverUse;
  return flush ? '0' : handlePadding(hasStructuredFooter, popoverUse);
}, function (_ref2) {
  var align = _ref2.align;
  return align;
}, function (_ref3) {
  var hasStep = _ref3.hasStep;
  return hasStep ? css(["display:flex;justify-content:space-between;align-items:center;"]) : null;
});
export default function UIPopoverFooter(_ref4) {
  var className = _ref4.className,
      rest = _objectWithoutProperties(_ref4, ["className"]);

  return /*#__PURE__*/_jsx(Footer, Object.assign({}, rest, {
    className: classNames(className, 'uiPopoverFooter private-popover__footer'),
    popoverUse: useContext(PopoverContext).use
  }));
}
UIPopoverFooter.propTypes = {
  align: PropTypes.oneOf(['left', 'right']).isRequired,
  children: PropTypes.node,
  flush: PropTypes.bool,
  hasStep: PropTypes.bool,
  hasStructuredFooter: PropTypes.bool
};
UIPopoverFooter.defaultProps = {
  align: 'left',
  hasStructuredFooter: false,
  hasStep: false
};
UIPopoverFooter.displayName = 'UIPopoverFooter';