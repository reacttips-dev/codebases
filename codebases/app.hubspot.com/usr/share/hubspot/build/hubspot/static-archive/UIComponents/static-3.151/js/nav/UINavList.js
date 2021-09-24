'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isValidElement, cloneElement, Children } from 'react';
import devLogger from 'react-utils/devLogger';
import getComponentName from 'react-utils/getComponentName';
import createReactClass from 'create-react-class';
import classNames from 'classnames';
import I18n from 'I18n';
import { warnIfFragment } from '../utils/devWarnings';
import { isChildActive, containsActiveChild } from './utils/navUtils';
import { MICROCOPY_SIZE } from 'HubStyleTokens/sizes';
import UINavListItem from './UINavListItem';
import UIButton from '../button/UIButton';
import UILink from '../link/UILink';
import HR from '../elements/HR';
import H7 from '../elements/headings/H7';
var hasPingedNewRelic = false;
var Ul = styled.ul.withConfig({
  displayName: "UINavList__Ul",
  componentId: "sc-83elzm-0"
})(["list-style:none;padding-left:0;margin-bottom:4px;line-height:16px;& .private-nav__wrapper{.private-nav-item{font-size:", ";padding-bottom:8px;padding-top:8px;padding-left:24px;}.private-folder-nav-item{padding-left:20px;}}", ""], MICROCOPY_SIZE, function (_ref) {
  var depth = _ref.depth;
  return depth === 0 ? "margin-bottom: 0;" : "\n    .private-nav__wrapper .private-nav-item {\n      padding-left: " + 20 * (depth + 1) + "px;\n    }\n\n    .private-nav__wrapper {\n      ul {\n        margin-bottom: 0;\n      }\n    }\n    ";
});
var Nav = styled.nav.withConfig({
  displayName: "UINavList__Nav",
  componentId: "sc-83elzm-1"
})(["margin-bottom:20px;.private-nav__wrapper{margin-bottom:0;}"]);
var UINavList = createReactClass({
  displayName: 'UINavList',
  propTypes: {
    'aria-label': PropTypes.string,
    children: PropTypes.node,
    depth: PropTypes.number,
    divider: PropTypes.bool,
    headingText: PropTypes.node,
    value: PropTypes.node,
    _rootComponent: PropTypes.func,
    _transformChildProps: PropTypes.func
  },
  getDefaultProps: function getDefaultProps() {
    return {
      depth: 0,
      value: null,
      _transformChildProps: function _transformChildProps() {
        return {};
      }
    };
  },
  rerenderFromRoot: function rerenderFromRoot(children) {
    if (children == null) return null;
    var _this$props = this.props,
        depth = _this$props.depth,
        value = _this$props.value,
        _rootComponent = _this$props._rootComponent,
        _transformChildProps = _this$props._transformChildProps;
    var Root = _rootComponent || UINavList;
    var props = {
      depth: depth + 1,
      value: value,
      _rootComponent: _rootComponent,
      _transformChildProps: _transformChildProps
    };
    return /*#__PURE__*/_jsx(Root, Object.assign({}, props, {
      children: children
    }));
  },
  render: function render() {
    var _this = this;

    var _this$props2 = this.props,
        ariaLabel = _this$props2['aria-label'],
        children = _this$props2.children,
        className = _this$props2.className,
        depth = _this$props2.depth,
        divider = _this$props2.divider,
        headingText = _this$props2.headingText,
        __rootComponent = _this$props2._rootComponent,
        value = _this$props2.value,
        rest = _objectWithoutProperties(_this$props2, ["aria-label", "children", "className", "depth", "divider", "headingText", "_rootComponent", "value"]);

    var classes = classNames(className, 'private-nav__wrapper');
    var isTopLevelNav = depth === 0;
    var computedAriaLabel = ariaLabel || headingText || I18n.text('ui.UISideNav.navigationLandmark');

    if (isTopLevelNav && computedAriaLabel === I18n.text('ui.UISideNav.navigationLandmark')) {
      devLogger.warn({
        message: "UISideNav: In order for screenreaders to understand the content of your UISideNav, label it with a unique, descriptive aria-label. You do not need to include the word \"navigation\" in your label as it will be added to the end automatically.",
        key: "UISideNav"
      });
    }

    return /*#__PURE__*/_jsxs(Nav, Object.assign({}, rest, {
      className: classes,
      "aria-label": isTopLevelNav ? computedAriaLabel : null,
      as: isTopLevelNav ? 'nav' : 'div',
      children: [divider && /*#__PURE__*/_jsx(HR, {}), headingText && /*#__PURE__*/_jsx(H7, {
        children: headingText
      }), /*#__PURE__*/_jsx(Ul, {
        depth: depth,
        children: Children.map(children, function (child) {
          if (! /*#__PURE__*/isValidElement(child)) {
            return child;
          }

          var defaultOpen = child && child.props && child.props.defaultOpen;

          if (child.type === HR || child.type === H7) {
            return child; // to prevent a console warning as a result of UISideNav having H7 or HR as children
          } else if ( // Converts buttons, links, and a tags to `UINavListItem`s
          child.type === UIButton || child.type === UILink || child.type === 'a') {
            var _child$props = child.props,
                __children = _child$props.children,
                __useNativeButton = _child$props._useNativeButton,
                otherProps = _objectWithoutProperties(_child$props, ["children", "_useNativeButton"]);

            devLogger.warn({
              message: "UISideNav: Using a UIButton, UILink, or an <a> as a child is deprecated. " + "Use a `UISideNavItem` instead.",
              key: "UISideNav"
            });

            if (window.newrelic && !hasPingedNewRelic) {
              window.newrelic.addPageAction('deprecated-nav-child', {
                type: typeof child.type === 'string' ? child.type : getComponentName(child.type)
              });
              hasPingedNewRelic = true;
            }

            return /*#__PURE__*/_jsx(UINavListItem, Object.assign({
              "aria-label": ariaLabel,
              active: isChildActive(child, value),
              defaultOpen: defaultOpen || containsActiveChild(child, value),
              href: child.props.href,
              onClick: child.props.onClick,
              title: child.props.children,
              value: undefined,
              _rootRenderer: _this.rerenderFromRoot
            }, otherProps));
          }

          warnIfFragment(child, UINavList.displayName);
          return /*#__PURE__*/cloneElement(child, {
            active: isChildActive(child, value),
            defaultOpen: defaultOpen || containsActiveChild(child, value),
            value: undefined,
            _rootRenderer: _this.rerenderFromRoot
          });
        })
      })]
    }));
  }
});
export default UINavList;