'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIBanner from 'UIComponents/alert/UIBanner';
import UIButtonWrapper from 'UIComponents/layout/UIButtonWrapper';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIBox from 'UIComponents/layout/UIBox';
import H5 from 'UIComponents/elements/headings/H5';
import { WEB_FONT_BOLD_WEIGHT } from 'HubStyleTokens/misc';
export var BANNER_VARIANTS = {
  WRAPPED: 'wrapperBanner'
};

var WrappedBannerContent = function WrappedBannerContent(_ref) {
  var titleText = _ref.titleText,
      subtext = _ref.subtext,
      button = _ref.button;
  return /*#__PURE__*/_jsxs(UIFlex, {
    align: "center",
    direction: "row",
    children: [/*#__PURE__*/_jsxs(UIBox, {
      grow: 1,
      children: [/*#__PURE__*/_jsx(H5, {
        className: "m-right-8 m-bottom-0",
        style: {
          fontWeight: WEB_FONT_BOLD_WEIGHT
        },
        children: titleText
      }), /*#__PURE__*/_jsx("div", {
        className: "m-bottom-1 m-top-0 m-right-1",
        children: subtext
      })]
    }), /*#__PURE__*/_jsx(UIBox, {
      shrink: 0,
      children: button
    })]
  });
};

var BannerContent = function BannerContent(_ref2) {
  var wrapped = _ref2.wrapped,
      subtext = _ref2.subtext,
      titleText = _ref2.titleText,
      button = _ref2.button;

  if (wrapped) {
    return /*#__PURE__*/_jsx(WrappedBannerContent, {
      titleText: titleText,
      subtext: subtext,
      button: button
    });
  } else {
    return /*#__PURE__*/_jsx("div", {
      className: "private-upgrades-message",
      children: /*#__PURE__*/_jsxs(UIButtonWrapper, {
        children: [/*#__PURE__*/_jsx("p", {
          className: "m-bottom-0 m-right-4 private-upgrades-message-text",
          children: subtext
        }), button]
      })
    });
  }
};

export var DefaultBanner = function DefaultBanner(_ref3) {
  var button = _ref3.button,
      className = _ref3.className,
      closeable = _ref3.closeable,
      condensed = _ref3.condensed,
      dataTestId = _ref3.dataTestId,
      onClose = _ref3.onClose,
      style = _ref3.style,
      subtext = _ref3.subtext,
      titleText = _ref3.titleText,
      variant = _ref3.variant;
  return /*#__PURE__*/_jsx(UIBanner, {
    className: className + " private-upgrades-message-" + (condensed ? 'condensed' : 'expanded'),
    closeable: closeable,
    "data-test-id": dataTestId,
    onClose: onClose,
    style: style,
    titleText: variant !== BANNER_VARIANTS.WRAPPED && titleText,
    children: /*#__PURE__*/_jsx(BannerContent, {
      titleText: titleText,
      wrapped: variant === BANNER_VARIANTS.WRAPPED,
      subtext: subtext,
      button: button
    })
  });
};
DefaultBanner.propTypes = {
  button: PropTypes.node,
  className: PropTypes.string,
  closeable: PropTypes.bool,
  condensed: PropTypes.bool,
  dataTestId: PropTypes.string,
  onClose: PropTypes.func,
  subtext: PropTypes.node,
  style: PropTypes.object,
  titleText: PropTypes.node,
  variant: PropTypes.string
};