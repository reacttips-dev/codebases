'use es6';

import { isMS } from './BrowserTest';
export var overflowsX = function overflowsX(innerEl) {
  var outerEl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : innerEl;

  if (innerEl === null || outerEl === null) {
    return false;
  }

  var tolerance = isMS() ? 1 : 0; // IE/Edge rounding workaround; see HubSpot/UIComponents#1711

  var contentWidth = innerEl.scrollWidth;
  var containerWidth = outerEl.clientWidth;
  return contentWidth > containerWidth + tolerance;
};
export var overflowsY = function overflowsY(innerEl) {
  var outerEl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : innerEl;

  if (innerEl === null || outerEl === null) {
    return false;
  }

  var tolerance = isMS() ? 1 : 0; // IE/Edge rounding workaround; see HubSpot/UIComponents#1711

  var contentHeight = innerEl.scrollHeight;
  var containerHeight = outerEl.clientHeight;
  return contentHeight > containerHeight + tolerance;
};