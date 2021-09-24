'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import { cloneElement, Children } from 'react';
import UITooltip from '../tooltip/UITooltip';
import SyntheticEvent from '../core/SyntheticEvent';
import Controllable from '../decorators/Controllable';
/* eslint-disable no-script-url */

var NOOP_HREF = 'javascript:void(0)'; // Match the protocol part of an absolute URL, e.g. "http:"

var PROTOCOL_REGEX = /^([^:]+):/; // Whitespace and control characters are ignored, so we must strip them out
// eslint-disable-next-line no-control-regex

var IGNORED_PROTOCOL_CHARS_REGEX = /[\s\x00-\x1f]/g;
export var isUnsafeUrl = function isUnsafeUrl(href) {
  if (href && typeof href === 'string') {
    var protocolMatch = href.match(PROTOCOL_REGEX);
    if (!protocolMatch || href === NOOP_HREF) return false;

    if (protocolMatch[0].replace(IGNORED_PROTOCOL_CHARS_REGEX, '').toLowerCase() === 'javascript:') {
      return true;
    }
  }

  return false;
};
export var getSafeUrl = function getSafeUrl(href) {
  if (href && typeof href === 'object' && typeof href.safeHref === 'string') {
    return href.safeHref;
  }

  return isUnsafeUrl(href) ? NOOP_HREF : href;
};
export var XSSTooltip = Controllable(function (_ref) {
  var children = _ref.children,
      onOpenChange = _ref.onOpenChange,
      open = _ref.open;
  var child = Children.only(children);
  return /*#__PURE__*/_jsx(UITooltip, {
    open: open,
    title: I18n.text('salesUI.XSSTooltip.explanation'),
    use: "danger",
    children: /*#__PURE__*/cloneElement(child, {
      href: NOOP_HREF,
      onClick: function onClick(evt) {
        child.props.onClick(evt);
        onOpenChange(SyntheticEvent(!open));
      }
    })
  });
}, ['open']);