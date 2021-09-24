'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import VizExNotificationBadge from 'visitor-ui-component-library/badge/VizExNotificationBadge';
import CloseIcon from './CloseIcon';
import OpenIcon from './OpenIcon';
import { CIRCLE, SQUARE } from './constants/launcherShapes';
import { OBSIDIAN, OLAF } from 'HubStyleTokens/colors';
import { getDropShadowStyles } from './constants/getDropShadowStyles';
import { launcherHeight, launcherWidth } from './constants/launcherDimensions';
import TwistFadeTransition from '../presentation-components/TwistFadeTransition';
var BaseLauncher = styled.button.withConfig({
  displayName: "IconLauncher__BaseLauncher",
  componentId: "sc-3vuzkq-0"
})(["", ";", " transition:box-shadow 150ms ease-in-out;position:relative;&:hover{cursor:pointer;}&:focus{outline:none;}"], function (_ref) {
  var disableDropShadow = _ref.disableDropShadow;
  return !disableDropShadow && getDropShadowStyles();
}, function (_ref2) {
  var borderColor = _ref2.borderColor;
  return borderColor ? "border: 1px solid " + borderColor + ";" : 'border: none;';
});
var SquareLauncher = styled(BaseLauncher).withConfig({
  displayName: "IconLauncher__SquareLauncher",
  componentId: "sc-3vuzkq-1"
})(["border-radius:6px;height:", "px;width:", "px;"], launcherHeight, launcherWidth);
var CircleLauncher = styled(BaseLauncher).withConfig({
  displayName: "IconLauncher__CircleLauncher",
  componentId: "sc-3vuzkq-2"
})(["border-radius:50%;height:", "px;width:", "px;"], launcherHeight, launcherWidth);
var LauncherIcon = styled.div.withConfig({
  displayName: "IconLauncher__LauncherIcon",
  componentId: "sc-3vuzkq-3"
})(["position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;", ""], function (_ref3) {
  var width = _ref3.width,
      height = _ref3.height;
  return "width: " + width + "px; height: " + height + "px;";
});

var IconLauncher = /*#__PURE__*/function (_Component) {
  _inherits(IconLauncher, _Component);

  function IconLauncher() {
    _classCallCheck(this, IconLauncher);

    return _possibleConstructorReturn(this, _getPrototypeOf(IconLauncher).apply(this, arguments));
  }

  _createClass(IconLauncher, [{
    key: "renderIcon",
    value: function renderIcon() {
      var _this$props = this.props,
          altText = _this$props.altText,
          open = _this$props.open,
          useDefaultColor = _this$props.useDefaultColor,
          overrideIconColor = _this$props.overrideIconColor;
      var color = useDefaultColor ? OBSIDIAN : OLAF;
      return /*#__PURE__*/_jsxs("div", {
        open: open,
        alt: altText,
        children: [/*#__PURE__*/_jsx(TwistFadeTransition, {
          in: open,
          direction: "left",
          children: /*#__PURE__*/_jsx(LauncherIcon, {
            width: 20,
            height: 20,
            children: /*#__PURE__*/_jsx(CloseIcon, {
              color: overrideIconColor || color,
              width: 20,
              height: 20
            })
          })
        }), /*#__PURE__*/_jsx(TwistFadeTransition, {
          in: !open,
          direction: "right",
          children: /*#__PURE__*/_jsx(LauncherIcon, {
            width: 32,
            height: 30,
            children: /*#__PURE__*/_jsx(OpenIcon, {
              color: overrideIconColor || color,
              width: 32,
              height: 30
            })
          })
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
          style = _this$props2.style,
          overrideBorderColor = _this$props2.overrideBorderColor;
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

      return /*#__PURE__*/_jsx(VizExNotificationBadge, {
        badgeLabel: badgeNumber,
        showBadge: showBadge,
        positioning: "on-circle",
        children: /*#__PURE__*/_jsx(ShapedLauncher, {
          "aria-label": ariaLabel,
          "aria-haspopup": ariaHaspopup,
          disableDropShadow: disableDropShadow,
          borderColor: overrideBorderColor,
          style: style,
          className: className,
          onClick: onClick,
          children: this.renderIcon()
        })
      });
    }
  }]);

  return IconLauncher;
}(Component);

IconLauncher.displayName = 'IconLauncher';
IconLauncher.defaultProps = {
  open: false,
  onClick: function onClick() {},
  showBadge: false,
  shape: CIRCLE
};
IconLauncher.propTypes = {
  altText: PropTypes.string.isRequired,
  ariaHaspopup: PropTypes.bool.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  badgeNumber: PropTypes.number,
  className: PropTypes.string,
  disableDropShadow: PropTypes.bool,
  onClick: PropTypes.func,
  open: PropTypes.bool.isRequired,
  overrideBorderColor: PropTypes.string,
  overrideIconColor: PropTypes.string,
  shape: PropTypes.oneOf([SQUARE, CIRCLE]),
  showBadge: PropTypes.bool.isRequired,
  style: PropTypes.object,
  useDefaultColor: PropTypes.bool.isRequired
};
export default IconLauncher;