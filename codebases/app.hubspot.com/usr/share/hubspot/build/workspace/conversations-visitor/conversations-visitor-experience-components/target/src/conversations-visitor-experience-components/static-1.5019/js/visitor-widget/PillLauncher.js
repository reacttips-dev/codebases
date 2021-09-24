'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import VizExNotificationBadge from 'visitor-ui-component-library/badge/VizExNotificationBadge';
import { OBSIDIAN, OLAF } from 'HubStyleTokens/colors';
import { getDropShadowStyles } from './constants/getDropShadowStyles';
var PillLauncherContainer = styled.button.withConfig({
  displayName: "PillLauncher__PillLauncherContainer",
  componentId: "woo6k3-0"
})(["border-top-left-radius:30px;border-bottom-left-radius:30px;border-top-right-radius:30px;border-bottom-right-radius:4px;height:50px;padding-left:25px;padding-right:25px;", ";", " transition:box-shadow 100ms ease-in-out;position:relative;&:hover{cursor:pointer;}"], function (_ref) {
  var disableDropShadow = _ref.disableDropShadow;
  return !disableDropShadow && getDropShadowStyles();
}, function (_ref2) {
  var borderColor = _ref2.borderColor;
  return borderColor ? "border: 1px solid " + borderColor + ";" : 'border: none;';
});
var LauncherText = styled.span.withConfig({
  displayName: "PillLauncher__LauncherText",
  componentId: "woo6k3-1"
})(["user-select:none;color:", ";white-space:nowrap;"], function (_ref3) {
  var color = _ref3.color;
  return color;
});

var PillLauncher = /*#__PURE__*/function (_Component) {
  _inherits(PillLauncher, _Component);

  function PillLauncher() {
    _classCallCheck(this, PillLauncher);

    return _possibleConstructorReturn(this, _getPrototypeOf(PillLauncher).apply(this, arguments));
  }

  _createClass(PillLauncher, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          ariaLabel = _this$props.ariaLabel,
          ariaHaspopup = _this$props.ariaHaspopup,
          badgeNumber = _this$props.badgeNumber,
          disableDropShadow = _this$props.disableDropShadow,
          text = _this$props.text,
          useDefaultColor = _this$props.useDefaultColor,
          onClick = _this$props.onClick,
          className = _this$props.className,
          showBadge = _this$props.showBadge,
          style = _this$props.style,
          overrideBorderColor = _this$props.overrideBorderColor,
          overrideTextColor = _this$props.overrideTextColor;
      var textColor = useDefaultColor ? OBSIDIAN : OLAF;

      var TextComponent = /*#__PURE__*/_jsx(LauncherText, {
        color: overrideTextColor || textColor,
        isDark: useDefaultColor,
        children: text
      });

      return /*#__PURE__*/_jsx(PillLauncherContainer, {
        "aria-label": ariaLabel,
        "aria-haspopup": ariaHaspopup,
        disableDropShadow: disableDropShadow,
        isDark: useDefaultColor,
        style: style,
        className: className,
        onClick: onClick,
        borderColor: overrideBorderColor,
        children: showBadge ? /*#__PURE__*/_jsx(VizExNotificationBadge, {
          badgeLabel: badgeNumber,
          positioning: "on-circle",
          children: TextComponent
        }) : TextComponent
      });
    }
  }]);

  return PillLauncher;
}(Component);

PillLauncher.displayName = 'PillLauncher';
PillLauncher.defaultProps = {
  onClick: function onClick() {},
  showBadge: false,
  text: '',
  disableDropShadow: false
};
PillLauncher.propTypes = {
  ariaHaspopup: PropTypes.bool.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  badgeNumber: PropTypes.number,
  className: PropTypes.string,
  disableDropShadow: PropTypes.bool,
  onClick: PropTypes.func,
  overrideBorderColor: PropTypes.string,
  overrideTextColor: PropTypes.string,
  showBadge: PropTypes.bool.isRequired,
  style: PropTypes.object,
  text: PropTypes.string.isRequired,
  useDefaultColor: PropTypes.bool.isRequired
};
export default PillLauncher;