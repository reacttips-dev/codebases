'use es6';

import { isCursorOver } from '../tooltip/utils/Hover';
import { isInPopoversAttachedTo } from '../utils/Dom'; // Determine the maximum value of scrollTop for this element

var getMaxScrollTop = function getMaxScrollTop(el) {
  return el.scrollHeight - el.clientHeight;
}; // Scroll each target in the array by the given delta


function applyScrollDeltas(deltasToApply) {
  deltasToApply.forEach(function (_ref) {
    var scrollTarget = _ref.scrollTarget,
        delta = _ref.delta;
    scrollTarget.scrollTop += delta;
  });
} // Prevent a wheel event from causing scrolling outside of the given container


export function constrainVerticalWheelEvent(evt, containerEl) {
  var deltaMode = evt.deltaMode,
      deltaY = evt.deltaY; // Ignore this event if it's not vertical or if deltaMode isn't "pixel"

  if (deltaMode !== 0 || deltaY === 0) {
    return;
  } // Ignore this event if the given container doesn't exist in the DOM


  if (!document.body.contains(containerEl)) {
    return;
  } // Ignore this event if it bubbled up from a portal (#5563)


  if (!containerEl.contains(evt.target)) {
    return;
  }

  var deltasToApply = [];
  var scrollTarget = evt.target;
  var remainingDelta = deltaY; // Track how much each element within the panel should be scrolled

  while (scrollTarget !== containerEl) {
    var _scrollTop = scrollTarget.scrollTop;

    if (remainingDelta > 0) {
      var _maxScrollTop = getMaxScrollTop(scrollTarget);

      if (_scrollTop + remainingDelta <= _maxScrollTop) {
        return; // This element will "absorb" all scrolling
      }

      var delta = _maxScrollTop - _scrollTop;
      deltasToApply.push({
        scrollTarget: scrollTarget,
        delta: delta
      });
      remainingDelta -= delta;
    } else {
      if (_scrollTop + remainingDelta >= 0) {
        return; // This element will "absorb" all scrolling
      }

      var _delta = -_scrollTop;

      deltasToApply.push({
        scrollTarget: scrollTarget,
        delta: _delta
      });
      remainingDelta -= _delta;
    }

    scrollTarget = scrollTarget.parentElement;
  } // At this point, the only element left is the panel itself


  var scrollTop = containerEl.scrollTop;
  var maxScrollTop = containerEl.scrollHeight - containerEl.clientHeight;

  if (scrollTop + remainingDelta >= maxScrollTop) {
    containerEl.scrollTop = maxScrollTop;
    evt.preventDefault();
    applyScrollDeltas(deltasToApply);
  } else if (scrollTop + remainingDelta <= 0) {
    containerEl.scrollTop = 0;
    evt.preventDefault();
    applyScrollDeltas(deltasToApply);
  }
} // Could the given click event have occurred within the given container element?

export function isClickWithinContainer(clickEvt, containerEl) {
  var clickTarget = clickEvt.target;
  var ownerDocument = clickTarget.ownerDocument; // Check if the click and container are in different documents (due to an <iframe>)

  if (ownerDocument !== containerEl.ownerDocument) {
    return false;
  } // Check if the click target has been unmounted (in which case it *could* be in the container)


  if (!ownerDocument.body.contains(clickTarget)) {
    return true;
  } // Check if the click target is a DOM descendant of the container


  if (containerEl.contains(clickTarget)) {
    return true;
  } // Check if the mouse cursor was within the container's bounds


  var containerArea = containerEl.getBoundingClientRect();

  if (isCursorOver(containerArea, clickEvt)) {
    return true;
  } // Check if the mouse cursor was within any popovers that are attached to the container.


  if (isInPopoversAttachedTo(containerEl, clickTarget)) return true;
  return false;
}