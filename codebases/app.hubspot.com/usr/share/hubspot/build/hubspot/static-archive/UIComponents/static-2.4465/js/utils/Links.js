'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import devLogger from 'react-utils/devLogger';
import { isUnsafeUrl, XSSTooltip } from './UnsafeUrl';
import { throwErrorAsync } from './ThrowError'; // Determine the target attr for an <a>, based on the props of the link component.

export var getTarget = function getTarget(external, target) {
  if (target !== undefined) {
    return target;
  }

  if (external) {
    return '_blank';
  }

  return undefined;
}; // Determine the rel attr for an <a>, based on the link component's rel prop and the target attr.

export var getRel = function getRel(rel, computedTarget) {
  if (rel !== undefined) {
    return rel;
  }

  if (computedTarget && computedTarget !== '_self') {
    // See https://mathiasbynens.github.io/rel-noopener/
    return 'noopener noreferrer';
  }

  return undefined;
};
export var warnIfShouldBeExternal = function warnIfShouldBeExternal(external, computedTarget, componentName) {
  if (!external && computedTarget && computedTarget !== '_self') {
    devLogger.warn({
      message: componentName + ": External links should include an icon. Use `external={true}`.",
      key: 'Link: should be external'
    });
  }
}; // If the given `href` might be an XSS vector, wrap the given rendered link in <XSSTooltip> and fire
// an error.

export var renderSecurityTaggedLink = function renderSecurityTaggedLink(href, renderedLink) {
  if (isUnsafeUrl(href)) {
    throwErrorAsync(new Error("Detected XSS attempt! href=\"" + href + "\""));
    return /*#__PURE__*/_jsx(XSSTooltip, {
      children: renderedLink
    });
  }

  return renderedLink;
};