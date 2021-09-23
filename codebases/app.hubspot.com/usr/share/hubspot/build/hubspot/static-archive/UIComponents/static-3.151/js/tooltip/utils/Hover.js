'use es6';

import { copyRect } from '../../utils/Rects';
var TOOLTIP_BUFFER_SIZE = 50;
/**
 * Detect if a mouseevent occurred within a given rectangle of UI coordinates
 **/

export var isCursorOver = function isCursorOver(boundingClientRect, mouseEvent) {
  var top = boundingClientRect.top,
      bottom = boundingClientRect.bottom,
      left = boundingClientRect.left,
      right = boundingClientRect.right;
  var X = mouseEvent.clientX,
      Y = mouseEvent.clientY;
  return X >= left && X <= right && Y <= bottom && Y >= top;
};
/**
 * Grows each edge of `originalRect` outward toward `magnetRect` by `bufferSize`. Used to determine
 * the "cursor space" between a tooltip target and the tooltip itself.
 *
 * @param {Object} originalRect
 * @param {Object} magnetRect
 * @param {number} bufferSize
 * @return {Object}
 */

var addBufferToRect = function addBufferToRect(originalRect, magnetRect, bufferSize) {
  var bufferedRect = copyRect(originalRect);

  if (originalRect.top > magnetRect.top) {
    bufferedRect.top = Math.max(magnetRect.top, originalRect.top - bufferSize);
  }

  if (originalRect.bottom < magnetRect.bottom) {
    bufferedRect.bottom = Math.min(magnetRect.bottom, originalRect.bottom + bufferSize);
  }

  if (originalRect.left > magnetRect.left) {
    bufferedRect.left = Math.max(magnetRect.left, originalRect.left - bufferSize);
  }

  if (originalRect.right < magnetRect.right) {
    bufferedRect.right = Math.min(magnetRect.right, originalRect.right + bufferSize);
  }

  return bufferedRect;
};
/**
 * Determine if a tooltip should close, given the `targetRect`, `tooltipRect`, and the originating
 * `mouseEvent`.
 *
 * @param {Object} targetRect
 * @param {Object} tooltipRect
 * @param {MouseEvent} mouseEvent
 * @return {boolean}
 **/


export var shouldTooltipClose = function shouldTooltipClose(targetRect, tooltipRect, mouseEvent) {
  if (isCursorOver(tooltipRect, mouseEvent)) return false;
  var bufferedTarget = addBufferToRect(targetRect, tooltipRect, TOOLTIP_BUFFER_SIZE);
  if (isCursorOver(bufferedTarget, mouseEvent)) return false;
  return true;
};