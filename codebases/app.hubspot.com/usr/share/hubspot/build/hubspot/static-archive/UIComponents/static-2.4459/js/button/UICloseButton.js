'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import memoize from 'react-utils/memoize';
import styled from 'styled-components';
import { EXTRA_LARGE_CLOSE_BUTTON_SIZE, MEDIUM_CLOSE_BUTTON_SIZE, MODAL_CLOSE_BUTTON_OFFSET, MODAL_CLOSE_BUTTON_SIZE, SMALL_CLOSE_BUTTON_SIZE } from 'HubStyleTokens/sizes';
import { propTypeForSizes, toShorthandSize } from '../utils/propTypes/tshirtSize';
import { toPx } from '../utils/Styles';
import UIDialogButton from '../dialog/UIDialogButton';
var SIZE_OPTIONS = {
  sm: {
    size: SMALL_CLOSE_BUTTON_SIZE,
    padding: 12
  },
  md: {
    size: MEDIUM_CLOSE_BUTTON_SIZE,
    padding: 16
  },
  lg: {
    size: MODAL_CLOSE_BUTTON_SIZE,
    padding: 20
  },
  xl: {
    size: EXTRA_LARGE_CLOSE_BUTTON_SIZE,
    padding: 38
  }
};
var CloseButton = styled(UIDialogButton).withConfig({
  displayName: "UICloseButton__CloseButton",
  componentId: "sc-1gunynx-0"
})(["position:absolute;right:", ";top:", ";width:", ";height:", ";color:", ";&::after{padding:", ";}"], MODAL_CLOSE_BUTTON_OFFSET, MODAL_CLOSE_BUTTON_OFFSET, function (_ref) {
  var size = _ref.size;
  return toPx(size);
}, function (_ref2) {
  var size = _ref2.size;
  return toPx(size);
}, function (_ref3) {
  var color = _ref3.color;
  return color;
}, function (_ref4) {
  var padding = _ref4.padding;
  return toPx(padding);
});
var CloseIcon = styled.svg.withConfig({
  displayName: "UICloseButton__CloseIcon",
  componentId: "sc-1gunynx-1"
})(["color:inherit;display:block;flex-grow:1;"]);
var CloseIconInner = styled.path.withConfig({
  displayName: "UICloseButton__CloseIconInner",
  componentId: "sc-1gunynx-2"
})(["fill:currentColor;stroke:currentColor;stroke-width:2;"]);
var renderCloseIcon = memoize(function () {
  return /*#__PURE__*/_jsx(CloseIcon, {
    viewBox: "0 0 14 14",
    xmlns: "http://www.w3.org/2000/svg",
    children: /*#__PURE__*/_jsx(CloseIconInner, {
      d: "M14.5,1.5l-13,13m0-13,13,13",
      transform: "translate(-1 -1)"
    })
  });
});

var UICloseButton = function UICloseButton(_ref5) {
  var className = _ref5.className,
      disabled = _ref5.disabled,
      size = _ref5.size,
      rest = _objectWithoutProperties(_ref5, ["className", "disabled", "size"]);

  var sizeOptions = SIZE_OPTIONS[toShorthandSize(size)];
  return /*#__PURE__*/_jsx(CloseButton, Object.assign({}, rest, {
    "aria-label": I18n.text('salesUI.UICloseButton.label'),
    className: classNames('private-close__button', className),
    "data-action": "close",
    disabled: disabled,
    IconHolder: renderCloseIcon,
    padding: sizeOptions.padding,
    size: sizeOptions.size
  }));
};

UICloseButton.propTypes = {
  color: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  size: propTypeForSizes(['sm', 'md', 'lg', 'xl'])
};
UICloseButton.defaultProps = {
  disabled: false,
  size: 'lg'
};
UICloseButton.displayName = 'UICloseButton';
export default UICloseButton;