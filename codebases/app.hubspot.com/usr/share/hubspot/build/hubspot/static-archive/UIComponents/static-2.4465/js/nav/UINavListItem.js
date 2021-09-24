'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { isValidElement, Component } from 'react';
import styled, { css } from 'styled-components';
import AccordionTransition from '../transitions/AccordionTransition';
import classNames from 'classnames';
import Controllable from '../decorators/Controllable';
import HoverProvider from '../providers/HoverProvider';
import SyntheticEvent from '../core/SyntheticEvent';
import UIIcon from '../icon/UIIcon';
import UILink from '../link/UILink';
import UINavItemLabel from '../nav/UINavItemLabel';
import { hidden } from '../utils/propTypes/decorators';
import { isRenderable } from '../utils/propTypes/componentProp';
import { NAV_LIST_TRANSITION_ANIMATION_TIMING } from 'HubStyleTokens/times';
import { BASE_FONT_SIZE, MERCURY_LAYER, NAV_ITEM_PADDING_LEFT, NAV_ITEM_PADDING_RIGHT, NAV_ITEM_PADDING_Y, BASE_ICON_SPACING_X } from 'HubStyleTokens/sizes';
import { setFontSmoothing, setBorderRadius, setFontSize, FONT_FAMILIES } from '../utils/Styles';
import { CALYPSO } from 'HubStyleTokens/colors';
import { BASE_LINK_COLOR, SIDENAV_FOREGROUND_COLOR, SIDENAV_HOVERED_BACKGROUND_COLOR, SIDENAV_SELECTED_BACKGROUND_COLOR, BASE_FONT_COLOR } from 'HubStyleTokens/theme';
import { WEB_FONT_DEMI_BOLD_WEIGHT } from 'HubStyleTokens/misc';
import { emCalc } from '../core/Style';
var ICON_SIZE = 'xxs';
var NavListItemTransitionWrapper = styled(AccordionTransition.defaultProps.Wrapper).withConfig({
  displayName: "UINavListItem__NavListItemTransitionWrapper",
  componentId: "wmj3sa-0"
})(["margin-left:-", ";padding-left:", ";overflow:", ";"], NAV_ITEM_PADDING_LEFT, NAV_ITEM_PADDING_LEFT, function (_ref) {
  var transitioning = _ref.transitioning;
  return transitioning ? 'hidden' : 'visible';
});
var linkStyles = css(["display:flex;align-items:flex-start;", ";", ";", ";color:", ";left:-", ";line-height:16px;padding:", " ", " ", " ", ";position:relative;text-decoration:none;width:calc(100% + ", ");cursor:", ";"], setFontSmoothing('auto'), FONT_FAMILIES.default, setFontSize(BASE_FONT_SIZE), SIDENAV_FOREGROUND_COLOR, NAV_ITEM_PADDING_LEFT, NAV_ITEM_PADDING_Y, NAV_ITEM_PADDING_RIGHT, NAV_ITEM_PADDING_Y, NAV_ITEM_PADDING_LEFT, NAV_ITEM_PADDING_LEFT, function (_ref2) {
  var disabled = _ref2.disabled;
  return disabled === true ? 'not-allowed' : 'pointer';
});
var activeStyles = css(["color:", ";background-color:", ";font-weight:", ";", ";"], BASE_FONT_COLOR, SIDENAV_SELECTED_BACKGROUND_COLOR, WEB_FONT_DEMI_BOLD_WEIGHT, setBorderRadius());
var hoveredStyles = css(["", ";color:", ";text-decoration:none;:not(.private-folder-nav-item){background-color:", ";}"], setBorderRadius(), BASE_FONT_COLOR, SIDENAV_HOVERED_BACKGROUND_COLOR);
var parentStyles = css(["user-select:none;"]);
var StyledLink = styled(function (props) {
  var Link = props.linkComponent,
      __active = props.active,
      __hasChildren = props.hasChildren,
      __hovered = props.hovered,
      __responsive = props.responsive,
      rest = _objectWithoutProperties(props, ["linkComponent", "active", "hasChildren", "hovered", "responsive"]);

  return /*#__PURE__*/_jsx(Link, Object.assign({}, rest));
}).withConfig({
  displayName: "UINavListItem__StyledLink",
  componentId: "wmj3sa-1"
})(["", " ", " &&{", ";}", " &.private-nav-item--active{", ";}&:focus{z-index:", ";}.private-tag--unenclosed{line-height:16px;}&& > .private-help-icon{display:inline-flex;}&& > .private-icon:not(.private-icon-circle__inner):not(:first-child),&& > .private-help-icon:not(:first-child) .private-icon{margin-left:", ";margin-right:0;}"], linkStyles, function (_ref3) {
  var active = _ref3.active;
  return active ? activeStyles : undefined;
}, function (_ref4) {
  var hovered = _ref4.hovered,
      disabled = _ref4.disabled;
  return hovered && !disabled ? hoveredStyles : undefined;
}, function (_ref5) {
  var hasChildren = _ref5.hasChildren;
  return hasChildren ? parentStyles : undefined;
}, activeStyles, MERCURY_LAYER, emCalc(BASE_ICON_SPACING_X));
var Icon = styled(UIIcon).withConfig({
  displayName: "UINavListItem__Icon",
  componentId: "wmj3sa-2"
})(["margin-right:", ";"], function (_ref6) {
  var placement = _ref6.placement;
  return placement === 'right' && '0 !important';
});
var NavItemLabel = styled(UINavItemLabel).withConfig({
  displayName: "UINavListItem__NavItemLabel",
  componentId: "wmj3sa-3"
})(["flex-grow:1;"]);

var UINavListItem = /*#__PURE__*/function (_Component) {
  _inherits(UINavListItem, _Component);

  function UINavListItem() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UINavListItem);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UINavListItem)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleClick = function (evt) {
      var _this$props = _this.props,
          onClick = _this$props.onClick,
          onOpenChange = _this$props.onOpenChange,
          open = _this$props.open;
      if (onClick) onClick(evt);

      if (!evt.defaultPrevented) {
        onOpenChange(SyntheticEvent(!open));
      }
    };

    return _this;
  }

  _createClass(UINavListItem, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          active = _this$props2.active,
          _children = _this$props2.children,
          className = _this$props2.className,
          count = _this$props2.count,
          duration = _this$props2.duration,
          __hovered = _this$props2.hovered,
          iconLeft = _this$props2.iconLeft,
          iconRight = _this$props2.iconRight,
          itemClassName = _this$props2.itemClassName,
          linkComponent = _this$props2.linkComponent,
          __onBlur = _this$props2.onBlur,
          __onClick = _this$props2.onClick,
          __onOpenChange = _this$props2.onOpenChange,
          open = _this$props2.open,
          _rootRenderer = _this$props2._rootRenderer,
          title = _this$props2.title,
          __value = _this$props2.value,
          rest = _objectWithoutProperties(_this$props2, ["active", "children", "className", "count", "duration", "hovered", "iconLeft", "iconRight", "itemClassName", "linkComponent", "onBlur", "onClick", "onOpenChange", "open", "_rootRenderer", "title", "value"]);

      var renderIcon = function renderIcon(icon, placement) {
        if (!icon) return null;

        if ( /*#__PURE__*/isValidElement(icon)) {
          return icon;
        }

        if (typeof icon === 'function') {
          return icon({
            children: _children,
            open: open,
            size: ICON_SIZE,
            placement: placement
          });
        }

        return /*#__PURE__*/_jsx(Icon, {
          name: icon,
          size: ICON_SIZE,
          placement: placement,
          color: placement === 'right' ? BASE_LINK_COLOR : CALYPSO
        });
      };

      return /*#__PURE__*/_jsx(HoverProvider, Object.assign({}, this.props, {
        children: function children(hoverProviderProps) {
          var hovered = hoverProviderProps.hovered,
              hoverProviderRestProps = _objectWithoutProperties(hoverProviderProps, ["hovered"]);

          var classes = classNames(className, 'private-nav-item', active && 'private-nav-item--active');
          return /*#__PURE__*/_jsxs("li", {
            className: itemClassName,
            children: [/*#__PURE__*/_jsxs(StyledLink, Object.assign({
              active: active,
              hasChildren: isRenderable(_children),
              hovered: hovered || undefined,
              linkComponent: linkComponent
            }, rest, {}, hoverProviderRestProps, {
              "aria-current": active ? 'true' : null,
              className: classes,
              onClick: _this2.handleClick,
              children: [renderIcon(iconLeft, 'left'), /*#__PURE__*/_jsx(NavItemLabel, {
                count: count,
                children: title
              }), renderIcon(iconRight, 'right')]
            })), /*#__PURE__*/_jsx(AccordionTransition, {
              open: open,
              duration: duration,
              Wrapper: NavListItemTransitionWrapper,
              children: isRenderable(_children) && _rootRenderer && _rootRenderer(_children)
            })]
          });
        }
      }));
    }
  }]);

  return UINavListItem;
}(Component);

UINavListItem.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node,
  count: PropTypes.node,
  external: PropTypes.bool,
  disabled: PropTypes.bool,
  duration: PropTypes.number,
  hovered: hidden(PropTypes.bool),
  iconLeft: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  iconRight: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  itemClassName: PropTypes.string,
  linkComponent: PropTypes.elementType,
  onOpenChange: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.node.isRequired,
  value: PropTypes.node,
  _rootRenderer: PropTypes.func
};
UINavListItem.defaultProps = {
  active: false,
  external: false,
  disabled: false,
  duration: parseInt(NAV_LIST_TRANSITION_ANIMATION_TIMING, 10),
  linkComponent: UILink,
  open: false
};
UINavListItem.displayName = 'UINavListItem';
export default Controllable(UINavListItem, ['open']);