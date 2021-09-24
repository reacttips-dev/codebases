'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import UICloseButton from '../button/UICloseButton';
import { SMALL_CLOSE_BUTTON_SIZE, MEDIUM_CLOSE_BUTTON_SIZE, POPOVER_PADDING_X, POPOVER_PADDING_Y } from 'HubStyleTokens/sizes';
import { CALYPSO, EERIE, OLAF } from 'HubStyleTokens/colors';
import { USE_CLASSES } from './utils/Use';
import { toShorthandSize } from '../utils/propTypes/tshirtSize';
import memoWithDisplayName from '../utils/memoWithDisplayName';
var CLOSE_BUTTON_USE_COLOR_MAP = {
  default: EERIE,
  shepherd: OLAF,
  longform: CALYPSO,
  tooltip: OLAF,
  'tooltip-danger': OLAF,
  unstyled: EERIE
};
var StyledCloseButton = styled(UICloseButton).withConfig({
  displayName: "UIPopoverCloseButton__StyledCloseButton",
  componentId: "tk33e7-0"
})(["position:relative;margin-left:", ";right:0;left:0;top:", ";"], function (_ref) {
  var size = _ref.size;
  return size === 'sm' ? SMALL_CLOSE_BUTTON_SIZE : MEDIUM_CLOSE_BUTTON_SIZE;
}, function (_ref2) {
  var size = _ref2.size;
  return (size === 'sm' ? 0 : parseInt(POPOVER_PADDING_X, 10) - parseInt(POPOVER_PADDING_Y, 10)) + "px";
});
var UIPopoverCloseButton = memoWithDisplayName('UIPopoverCloseButton', function (_ref3) {
  var popoverUse = _ref3.popoverUse,
      size = _ref3.size,
      rest = _objectWithoutProperties(_ref3, ["popoverUse", "size"]);

  var computedColor = CLOSE_BUTTON_USE_COLOR_MAP[popoverUse];
  var shorthandSize = toShorthandSize(popoverUse === 'longform' ? 'sm' : size);
  return /*#__PURE__*/_jsx(StyledCloseButton, Object.assign({
    color: computedColor,
    size: shorthandSize
  }, rest));
});
UIPopoverCloseButton.propTypes = {
  color: PropTypes.string,
  size: UICloseButton.propTypes.size,
  popoverUse: PropTypes.oneOf(Object.keys(USE_CLASSES))
};
UIPopoverCloseButton.defaultProps = {
  size: 'md',
  popoverUse: 'default'
};
export default UIPopoverCloseButton;