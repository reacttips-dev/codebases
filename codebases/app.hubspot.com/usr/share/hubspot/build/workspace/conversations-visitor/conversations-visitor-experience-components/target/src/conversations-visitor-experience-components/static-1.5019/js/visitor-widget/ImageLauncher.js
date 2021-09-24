'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import VizExNotificationBadge from 'visitor-ui-component-library/badge/VizExNotificationBadge';
import { CIRCLE, SQUARE } from './constants/launcherShapes';
import { launcherHeight, launcherWidth } from './constants/launcherDimensions';
import CloseIcon from './CloseIcon';
import { OBSIDIAN } from 'HubStyleTokens/colors';
import { getDropShadowStyles } from './constants/getDropShadowStyles';
var LauncherWrapper = styled.div.withConfig({
  displayName: "ImageLauncher__LauncherWrapper",
  componentId: "askuo0-0"
})(["height:", "px;width:", "px;"], launcherHeight, launcherWidth);
var BaseLauncher = styled.button.withConfig({
  displayName: "ImageLauncher__BaseLauncher",
  componentId: "askuo0-1"
})(["height:", "px;width:", "px;overflow:hidden;position:relative;transition:box-shadow 100ms ease-in-out;transition:background-image 200ms ease-in-out;padding:0;", ";", " &:hover{cursor:pointer;}"], launcherHeight, launcherWidth, function (_ref) {
  var disableDropShadow = _ref.disableDropShadow;
  return !disableDropShadow && getDropShadowStyles();
}, function (_ref2) {
  var borderColor = _ref2.borderColor;
  return borderColor ? "border: 1px solid " + borderColor + ";" : 'border: none;';
});
var SquareLauncher = styled(BaseLauncher).withConfig({
  displayName: "ImageLauncher__SquareLauncher",
  componentId: "askuo0-2"
})(["border-radius:6px;"]);
var CircleLauncher = styled(BaseLauncher).withConfig({
  displayName: "ImageLauncher__CircleLauncher",
  componentId: "askuo0-3"
})(["border-radius:50%;"]);
var BackgroundImage = styled.img.withConfig({
  displayName: "ImageLauncher__BackgroundImage",
  componentId: "askuo0-4"
})(["width:", "px;height:auto;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:99;", " transition:opacity 0.2s cubic-bezier(.25,.8,.25,1);"], launcherWidth + 1, function (_ref3) {
  var opacity = _ref3.opacity;
  return "opacity: " + opacity + ";";
});
var LauncherIcon = styled.div.withConfig({
  displayName: "ImageLauncher__LauncherIcon",
  componentId: "askuo0-5"
})(["position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;"]);

var ImageLauncher = /*#__PURE__*/function (_Component) {
  _inherits(ImageLauncher, _Component);

  function ImageLauncher() {
    _classCallCheck(this, ImageLauncher);

    return _possibleConstructorReturn(this, _getPrototypeOf(ImageLauncher).apply(this, arguments));
  }

  _createClass(ImageLauncher, [{
    key: "getIcon",
    value: function getIcon(open, isDark, customColor) {
      if (open) {
        return /*#__PURE__*/_jsx(CloseIcon, {
          color: customColor || OBSIDIAN,
          width: 20,
          height: 20
        });
      } else {
        return null;
      }
    }
  }, {
    key: "renderContent",
    value: function renderContent() {
      var _this$props = this.props,
          open = _this$props.open,
          useDefaultColor = _this$props.useDefaultColor,
          overrideIconColor = _this$props.overrideIconColor,
          customImage = _this$props.customImage;
      var icon = this.getIcon(open, useDefaultColor, overrideIconColor);
      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(BackgroundImage, {
          opacity: open ? 0 : 1,
          src: customImage
        }), /*#__PURE__*/_jsx(LauncherIcon, {
          open: open,
          children: icon
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          ariaLabel = _this$props2.ariaLabel,
          ariaHaspopup = _this$props2.ariaHaspopup,
          badgeNumber = _this$props2.badgeNumber,
          className = _this$props2.className,
          disableDropShadow = _this$props2.disableDropShadow,
          onClick = _this$props2.onClick,
          shape = _this$props2.shape,
          showBadge = _this$props2.showBadge,
          overrideBorderColor = _this$props2.overrideBorderColor,
          open = _this$props2.open,
          openStyles = _this$props2.openStyles;
      var ShapedLauncher;

      switch (shape) {
        case CIRCLE:
          ShapedLauncher = CircleLauncher;
          break;

        case SQUARE:
          ShapedLauncher = SquareLauncher;
          break;

        default:
          ShapedLauncher = CircleLauncher;
          break;
      }

      return /*#__PURE__*/_jsx(LauncherWrapper, {
        className: className,
        onClick: onClick,
        children: showBadge ? /*#__PURE__*/_jsx(VizExNotificationBadge, {
          badgeLabel: badgeNumber,
          positioning: "on-circle",
          children: /*#__PURE__*/_jsx(ShapedLauncher, {
            "aria-label": ariaLabel,
            "aria-haspopup": ariaHaspopup,
            disableDropShadow: disableDropShadow,
            borderColor: overrideBorderColor,
            shape: shape,
            style: open ? openStyles : null,
            children: this.renderContent()
          })
        }) : /*#__PURE__*/_jsx(ShapedLauncher, {
          "aria-label": ariaLabel,
          "aria-haspopup": ariaHaspopup,
          style: open ? openStyles : null,
          shape: shape,
          children: this.renderContent()
        })
      });
    }
  }]);

  return ImageLauncher;
}(Component);

ImageLauncher.displayName = 'ImageLauncher';
ImageLauncher.defaultProps = {
  open: false,
  onClick: function onClick() {},
  showBadge: false,
  shape: CIRCLE
};
ImageLauncher.propTypes = {
  ariaHaspopup: PropTypes.bool.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  badgeNumber: PropTypes.number,
  className: PropTypes.string,
  customImage: PropTypes.string,
  disableDropShadow: PropTypes.bool,
  onClick: PropTypes.func,
  open: PropTypes.bool,
  openStyles: PropTypes.object,
  overrideBorderColor: PropTypes.string,
  overrideIconColor: PropTypes.string,
  shape: PropTypes.oneOf([SQUARE, CIRCLE]),
  showBadge: PropTypes.bool.isRequired,
  useDefaultColor: PropTypes.bool
};
export default ImageLauncher;