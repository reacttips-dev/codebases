'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import { MERCURY_LAYER, TAB_FONT_SIZE, TAB_INDICATOR_HEIGHT, TAB_PADDING_X, TAB_PADDING_Y } from 'HubStyleTokens/sizes';
import { TABS_ACTIVATE_TRANSITION_TIMING } from 'HubStyleTokens/times';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import emptyFunction from 'react-utils/emptyFunction';
import styled, { css } from 'styled-components';
import { callIfPossible } from '../core/Functions';
import SyntheticEvent from '../core/SyntheticEvent';
import UIIcon from '../icon/UIIcon';
import UILink from '../link/UILink';
import { PLACEMENTS } from '../tooltip/PlacementConstants';
import UITooltip from '../tooltip/UITooltip';
import { hidden } from '../utils/propTypes/decorators';
import { getIconNamePropType } from '../utils/propTypes/iconName';
import { FONT_FAMILIES, setFontSize, setFontSmoothing, setInputMetrics, setUiTransition, toPx } from '../utils/Styles';
import { BORDER_COLOR, DISABLED_COLOR, ENCLOSED_BACKGROUND_COLOR, ENCLOSED_SHADED_BACKGROUND_COLOR, FOREGROUND_COLOR, FOREGROUND_FOCUS_COLOR } from './TabConstants';
import { getSelectedTabBackgroundColor, isContained } from './utils/tabUtils';
var TabIndicator = styled.span.withConfig({
  displayName: "UITab__TabIndicator",
  componentId: "lry3q3-0"
})(["", ";background-color:currentColor;border-radius:24px;bottom:", ";height:", ";left:0;opacity:", ";position:absolute;width:100%;z-index:", ";"], setUiTransition(), toPx(parseInt(TAB_INDICATOR_HEIGHT, 10) / 2 * -1), TAB_INDICATOR_HEIGHT, function (_ref) {
  var tabIsActive = _ref.tabIsActive;
  return tabIsActive ? '1 !important' : '0';
}, function (_ref2) {
  var tabIsActive = _ref2.tabIsActive;
  return tabIsActive ? MERCURY_LAYER : null;
});
var TabIcon = styled(function (props) {
  var __tabIsActive = props.tabIsActive,
      rest = _objectWithoutProperties(props, ["tabIsActive"]);

  return /*#__PURE__*/_jsx(UIIcon, Object.assign({}, rest));
}).withConfig({
  displayName: "UITab__TabIcon",
  componentId: "lry3q3-1"
})(["&&&&{color:", ";}"], function (_ref3) {
  var tabIsActive = _ref3.tabIsActive;
  return tabIsActive ? 'currentColor' : null;
});
TabIcon.displayName = 'StyledTabIcon';

var handleFontFamily = function handleFontFamily(isActive) {
  return isActive ? css(["", ";&:hover{", ";}"], FONT_FAMILIES.medium, FONT_FAMILIES.medium) : FONT_FAMILIES.default;
};

var handleHoverColor = function handleHoverColor(isActive) {
  return !isActive ? css(["&:hover{color:", ";}"], FOREGROUND_FOCUS_COLOR) : null;
};

var handleDisabledOnlyStyles = function handleDisabledOnlyStyles(isDisabled) {
  return isDisabled ? css(["cursor:not-allowed;", "{color:", ";}"], TabIcon, DISABLED_COLOR) : null;
};

var getBackgroundColor = function getBackgroundColor(use, active) {
  if (active) {
    return getSelectedTabBackgroundColor(use);
  }

  return use === 'enclosed-shaded' ? ENCLOSED_SHADED_BACKGROUND_COLOR : ENCLOSED_BACKGROUND_COLOR;
};

var handleContainedStyles = function handleContainedStyles(use, active) {
  return isContained(use) ? css(["transition:background-color ", " cubic-bezier(0.25,0.1,0.25,1);background-color:", ";border-left:1px solid ", ";&:first-child{border-left:0;border-top-left-radius:inherit;}&:last-of-type{border-top-right-radius:inherit;}", "{display:none;}", ";"], TABS_ACTIVATE_TRANSITION_TIMING, getBackgroundColor(use, active), BORDER_COLOR, TabIndicator, active ? css(["border-bottom-color:", ";&::after{background:", " !important;bottom:-1px;content:' ';height:1px;left:0;position:absolute;width:100%;}"], getSelectedTabBackgroundColor(use), getSelectedTabBackgroundColor(use)) : null) : null;
};

var StyledLink = styled(function (props) {
  var __active = props.active,
      __fill = props.fill,
      __use = props.use,
      rest = _objectWithoutProperties(props, ["active", "fill", "use"]);

  return /*#__PURE__*/_jsx(UILink, Object.assign({
    use: "unstyled"
  }, rest));
}).withConfig({
  displayName: "UITab__StyledLink",
  componentId: "lry3q3-2"
})(["&&{", ";", ";", ";", ";color:", ";position:relative;transition-property:", ";white-space:nowrap;&:focus{text-decoration:none;z-index:", ";}", ";", ";", ";", ";&.sr-only-focusable{align-items:center;display:inline-flex;}}"], setFontSmoothing('auto'), function (_ref4) {
  var active = _ref4.active;
  return handleFontFamily(active);
}, setFontSize(TAB_FONT_SIZE), setInputMetrics(TAB_PADDING_Y, TAB_PADDING_X, TAB_PADDING_X, TAB_PADDING_Y, false), function (_ref5) {
  var disabled = _ref5.disabled;
  return disabled ? DISABLED_COLOR + " !important" : FOREGROUND_COLOR;
}, function (_ref6) {
  var use = _ref6.use;
  return isContained(use) ? 'background-color, color' : 'color';
}, MERCURY_LAYER, function (_ref7) {
  var active = _ref7.active;
  return handleHoverColor(active);
}, function (_ref8) {
  var disabled = _ref8.disabled;
  return handleDisabledOnlyStyles(disabled);
}, function (_ref9) {
  var fill = _ref9.fill;
  return fill ? css(["text-align:center;width:100%;"]) : null;
}, function (_ref10) {
  var use = _ref10.use,
      active = _ref10.active;
  return handleContainedStyles(use, active);
});

var UITab = /*#__PURE__*/function (_PureComponent) {
  _inherits(UITab, _PureComponent);

  function UITab() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UITab);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UITab)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleClick = function (evt) {
      var _this$props = _this.props,
          onClick = _this$props.onClick,
          tabId = _this$props.tabId;
      callIfPossible(onClick, SyntheticEvent(tabId, evt));
    };

    return _this;
  }

  _createClass(UITab, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          active = _this$props2.active,
          className = _this$props2.className,
          disabled = _this$props2.disabled,
          icon = _this$props2.icon,
          Link = _this$props2.Link,
          __onClick = _this$props2.onClick,
          title = _this$props2.title,
          tabId = _this$props2.tabId,
          tooltip = _this$props2.tooltip,
          tooltipPlacement = _this$props2.tooltipPlacement,
          tooltipProps = _this$props2.tooltipProps,
          rest = _objectWithoutProperties(_this$props2, ["active", "className", "disabled", "icon", "Link", "onClick", "title", "tabId", "tooltip", "tooltipPlacement", "tooltipProps"]);

      var renderedTabContents = /*#__PURE__*/_jsxs(Link, Object.assign({}, rest, {
        active: active,
        className: classNames(className, 'private-tab', active && 'private-tab--active'),
        disabled: disabled,
        "data-tab-id": tabId,
        "data-tab-selected": active,
        onClick: this.handleClick,
        children: [icon ? /*#__PURE__*/_jsx(TabIcon, {
          tabIsActive: active,
          className: "private-tab__icon",
          name: icon,
          size: "xxs"
        }) : null, title, /*#__PURE__*/_jsx(TabIndicator, {
          tabIsActive: active,
          className: "private-tab__indicator"
        })]
      }));

      if (!tooltip) return renderedTabContents;
      return /*#__PURE__*/_jsx(UITooltip, Object.assign({
        placement: tooltipPlacement,
        title: tooltip
      }, tooltipProps, {
        children: renderedTabContents
      }));
    }
  }]);

  return UITab;
}(PureComponent);

UITab.displayName = 'UITab';
UITab.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  href: UILink.propTypes.href,
  icon: getIconNamePropType(),
  Link: hidden(PropTypes.elementType.isRequired),
  tabId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.node.isRequired,
  tooltip: PropTypes.node,
  tooltipProps: PropTypes.object,
  tooltipPlacement: PropTypes.oneOf(PLACEMENTS)
};
UITab.defaultProps = {
  Link: StyledLink,
  onClick: emptyFunction
};
export { UITab as default };