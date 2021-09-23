'use es6'; // Prevent unwanted focus styles

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import '../listeners/focusStylesListener';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import devLogger from 'react-utils/devLogger';
import memoWithDisplayName from '../utils/memoWithDisplayName';
import validHref from '../utils/propTypes/validHref';
import { getSafeUrl } from '../utils/UnsafeUrl';
import { getRel, getTarget, warnIfShouldBeExternal, renderSecurityTaggedLink } from '../utils/Links';
import { getTabIndex } from '../utils/TabIndex';
import { UNDERLINE_CLASSES, USE_CLASSES } from './LinkConstants';
import UIIcon from '../icon/UIIcon';
import UITruncateString from '../text/UITruncateString';
import refObject from '../utils/propTypes/refObject'; // Hide icon in tables, except on hover (#5679)

var truncatedExternalIconMixin = css([".private-table tr:not(:hover) .private-link:not(:focus) &{visibility:hidden;}"]);
var DefaultExternalIcon = styled(function (props) {
  var __truncated = props.truncated,
      rest = _objectWithoutProperties(props, ["truncated"]);

  return /*#__PURE__*/_jsx(UIIcon, Object.assign({}, rest));
}).withConfig({
  displayName: "UILink__DefaultExternalIcon",
  componentId: "sc-1e1c958-0"
})(["", ""], function (_ref) {
  var truncated = _ref.truncated;
  return truncated && truncatedExternalIconMixin;
});
var UILink = memoWithDisplayName('UILink', function (props) {
  var children = props.children,
      className = props.className,
      disabled = props.disabled,
      external = props.external,
      ExternalIcon = props.ExternalIcon,
      href = props.href,
      iconProps = props.iconProps,
      linkRef = props.linkRef,
      _onClick = props.onClick,
      _onKeyDown = props.onKeyDown,
      rel = props.rel,
      role = props.role,
      tabIndex = props.tabIndex,
      target = props.target,
      to = props.to,
      truncate = props.truncate,
      truncateStringProps = props.truncateStringProps,
      underline = props.underline,
      use = props.use,
      rest = _objectWithoutProperties(props, ["children", "className", "disabled", "external", "ExternalIcon", "href", "iconProps", "linkRef", "onClick", "onKeyDown", "rel", "role", "tabIndex", "target", "to", "truncate", "truncateStringProps", "underline", "use"]);

  if (process.env.NODE_ENV !== 'production') {
    if (to != null) {
      devLogger.warn({
        message: "UILink: The `to` prop is a no-op. Did you mean `href`? (`to=\"" + to + "\"`)",
        key: 'UILink: to'
      });
    }
  }

  var defaultLinkRef = useRef(null);
  var computedTarget = getTarget(external, target);
  var computedRel = getRel(rel, computedTarget);
  var computedRole = href ? undefined : role || 'button';
  var externalLinkIcon = external ? /*#__PURE__*/_jsx(ExternalIcon, Object.assign({
    "aria-label": I18n.text('salesUI.UILink.externalTitle'),
    name: "externalLink"
  }, iconProps, {
    className: classNames('private-link--external__icon', iconProps && iconProps.className),
    truncated: truncate
  })) : null;

  if (process.env.NODE_ENV !== 'production') {
    warnIfShouldBeExternal(external, computedTarget, 'UILink');
  }

  var wrappedChildren = truncate ? /*#__PURE__*/_jsx(UITruncateString, Object.assign({
    useFlex: true,
    fixedChildren: externalLinkIcon
  }, truncateStringProps, {
    children: children
  })) : children;

  var renderedLink = /*#__PURE__*/_jsxs("a", Object.assign({}, rest, {
    className: classNames('private-link', UNDERLINE_CLASSES[underline], USE_CLASSES[use], className, disabled && 'private-link--disabled'),
    onClick: function onClick(evt) {
      if (disabled) {
        evt.preventDefault();
        evt.stopPropagation();
      } else {
        if (_onClick) _onClick(evt);
      }
    },
    onKeyDown: function onKeyDown(evt) {
      // Simulate click on Spacebar, to emulate button behavior
      var key = evt.key;
      if (_onKeyDown) _onKeyDown(evt);
      if (!_onClick) return; // Ignore keydown events that bubbled up

      if (evt.target !== (linkRef || defaultLinkRef).current) return;

      if (key === ' ') {
        if (disabled) {
          evt.preventDefault();
          evt.stopPropagation();
          return;
        }

        _onClick(evt); // Prevent scrolling


        evt.preventDefault();
      }
    },
    href: disabled ? undefined : getSafeUrl(href),
    ref: linkRef || defaultLinkRef,
    rel: computedRel,
    role: computedRole,
    tabIndex: getTabIndex(disabled, tabIndex),
    target: computedTarget,
    "aria-disabled": disabled,
    children: [wrappedChildren, truncate ? null : externalLinkIcon]
  }));

  return renderSecurityTaggedLink(href, renderedLink);
});
UILink.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  external: PropTypes.bool.isRequired,
  ExternalIcon: PropTypes.elementType.isRequired,
  href: validHref,
  iconProps: PropTypes.object,
  linkRef: refObject,
  onKeyDown: PropTypes.func,
  rel: PropTypes.string,
  target: PropTypes.string,
  truncate: PropTypes.bool.isRequired,
  truncateStringProps: PropTypes.object,
  underline: PropTypes.bool.isRequired,
  use: PropTypes.oneOf(Object.keys(USE_CLASSES)).isRequired
};
UILink.defaultProps = {
  external: false,
  ExternalIcon: DefaultExternalIcon,
  truncate: false,
  underline: false,
  use: 'dark'
};
export default UILink;