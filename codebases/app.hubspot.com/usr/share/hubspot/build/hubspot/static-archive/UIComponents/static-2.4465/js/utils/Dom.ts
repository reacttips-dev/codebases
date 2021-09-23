import { FOCUSABLE as FOCUSABLE_SELECTOR } from '../constants/Selectors';
import { rotateAround } from './Arrays';
import { translateRect } from './Rects';
import { last } from './underscore'; // Polyfill for el.classList.contains(className) that doesn't fail for SVGs in IE11

export var elementHasClass = function elementHasClass(el, className) {
  return !!(el && el.classList && el.classList.contains(className));
}; // Polyfill for el.matches(selector)

export var matches = function matches(el, selector) {
  if (!el) {
    return false;
  }

  if (el.matches) {
    return el.matches(selector);
  }

  if (el.msMatchesSelector) {
    return el.msMatchesSelector(selector);
  }

  if (el.parentElement) {
    var matchingSiblings = el.parentElement.querySelectorAll(selector);

    for (var i = 0; i < matchingSiblings.length; i++) {
      if (matchingSiblings[i] === el) {
        return true;
      }
    }
  }

  return false;
}; // Polyfill for el.closest(selector)

export var closest = function closest(el, selector) {
  if (!el) {
    return null;
  }

  if (el.closest) {
    return el.closest(selector);
  }

  var currentEl = el;

  do {
    if (matches(currentEl, selector)) {
      return currentEl;
    }

    currentEl = currentEl.parentElement;
  } while (currentEl);

  return null;
}; // Is el within the bounds of the given screen?

export var elementIsOnScreen = function elementIsOnScreen(el) {
  var screen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var elementBounds = el.getBoundingClientRect();
  var xWithinBounds = elementBounds.right >= 0 && elementBounds.left <= screen.innerWidth;
  var yWithinBounds = elementBounds.bottom >= 0 && elementBounds.top <= screen.innerHeight;
  return xWithinBounds && yWithinBounds;
}; // Is el visible (for tabbing purposes)?

var elementIsVisible = function elementIsVisible(el) {
  var computedStyles = getComputedStyle(el, null); // Patch for Firefox < 62: https://bugzilla.mozilla.org/show_bug.cgi?id=1467722

  if (!computedStyles) return true;
  return computedStyles.visibility !== 'hidden';
}; // Returns an array containing every tabbable element within the given container. The array order
// reflects the tabbing order, unless positive tabIndex values (e.g. tabIndex={7}) are used.
// Such tabIndex values are exceedingly rare in modern web apps, so don't worry about it.


export var getTabbableElements = function getTabbableElements(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(function (el) {
    // Hidden elements aren't tabbable. Sadly, no CSS query can exclude such elements.
    return elementIsVisible(el);
  });
}; // Returns the next element after the given element (and its descendants) in the document tab order.

export var getNextTabbableElementExclusive = function getNextTabbableElementExclusive(startEl) {
  var allElements = Array.from(document.querySelectorAll('*'));

  for (var i = allElements.indexOf(startEl) + 1; i < allElements.length; i++) {
    var el = allElements[i];

    if (startEl.contains(el)) {
      continue;
    }

    if (matches(el, FOCUSABLE_SELECTOR) && elementIsVisible(el)) {
      return el;
    }
  }

  return null;
}; // Returns the previous element in the document tab order, *including* the given element and its
// descendants. This is equivalent to what the browser would focus if the user pressed Shift+Tab
// from the nextSibling of the given element, for example.

export var getPrevTabbableElementInclusive = function getPrevTabbableElementInclusive(startEl) {
  var focusableDescendants = getTabbableElements(startEl);

  if (focusableDescendants.length) {
    return last(focusableDescendants);
  }

  if (matches(startEl, FOCUSABLE_SELECTOR)) {
    return startEl;
  }

  var allElements = Array.from(document.querySelectorAll('*'));

  for (var i = allElements.indexOf(startEl) - 1; i >= 0; i--) {
    var el = allElements[i];

    if (matches(el, FOCUSABLE_SELECTOR) && elementIsVisible(el)) {
      return el;
    }
  }

  return null;
};
/**
 * Goes through all the elements matching `selector` within `container` starting from the one that
 * currently has the focus (or from the start), then moves the focus into the next one that can be
 * focused (or, if `reverse = true`, the previous one).
 *
 * @param {string} selector
 * @param {HTMLElement} container
 * @param {boolean} reverse
 * @return {?HTMLElement} The element that received the focus
 */

export var moveFocusToNext = function moveFocusToNext(selector, container) {
  var reverse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var allMatches = Array.from(container.querySelectorAll(selector));
  if (allMatches.length === 0) return null; // Get an ordered list of matching elements don't already contain the focus

  var currentMenuItem = closest(document.activeElement, selector);
  var candidateMatches = rotateAround(allMatches, currentMenuItem);
  candidateMatches = candidateMatches.filter(function (menuItem) {
    return !menuItem.contains(document.activeElement);
  }); // If reverse is set, flip the order so we move backward in the DOM

  if (reverse) candidateMatches.reverse(); // Move the focus to the first focusable element found within a candidate element

  for (var i = 0; i < candidateMatches.length; i++) {
    var focusTarget = candidateMatches[i].querySelector(FOCUSABLE_SELECTOR);

    if (focusTarget) {
      focusTarget.focus();
      return focusTarget;
    }
  }

  return null;
};
/**
 * Check if `descendantEl` is in a popover attached to `containerEl` (or a popover attached to a
 * popover attached to `containerEl`, or a popover attached to a popover attached to a popover...).
 *
 * @param {HTMLElement} containerEl
 * @param {HTMLElement} descendantEl
 * @return {boolean}
 */

export var isInPopoversAttachedTo = function isInPopoversAttachedTo(containerEl, descendantEl) {
  var popoverEls = Array.from(containerEl.querySelectorAll('[data-popover-id]'));
  return popoverEls.some(function (targetEl) {
    var popoverIds = targetEl.getAttribute('data-popover-id').split(' ');
    return popoverIds.some(function (popoverId) {
      var popoverEl = descendantEl.ownerDocument.getElementById(popoverId);

      if (popoverEl) {
        if (popoverEl.contains(descendantEl)) return true;
        return isInPopoversAttachedTo(popoverEl, descendantEl);
      }

      return false;
    });
  });
};

var getAttrAsList = function getAttrAsList(element, attrKey) {
  return element.hasAttribute(attrKey) ? element.getAttribute(attrKey).split(' ') : [];
};
/**
 * Add a single value to a DOM attribute that contains a list of space-separated values.
 */


export var addToListAttr = function addToListAttr(element, attrKey, newValue) {
  if (!element) return;
  var attrAsArray = getAttrAsList(element, attrKey);
  if (attrAsArray.includes(newValue)) return;
  element.setAttribute(attrKey, attrAsArray.concat(newValue).join(' '));
};
/**
 * Remove a single value from a DOM attribute that contains a list of space-separated values.
 */

export var removeFromListAttr = function removeFromListAttr(element, attrKey, value) {
  if (!element) return;
  var attrAsArray = getAttrAsList(element, attrKey);
  if (!attrAsArray.includes(value)) return;
  attrAsArray.splice(attrAsArray.indexOf(value), 1);

  if (attrAsArray.length === 0) {
    element.removeAttribute(attrKey);
  } else {
    element.setAttribute(attrKey, attrAsArray.join(' '));
  }
};
/**
 * @param {?string} attr
 * @param {string} value
 * @returns {boolean} True if the space-separated list attr includes the given value
 */

export var listAttrIncludes = function listAttrIncludes(attr, value) {
  return (attr || '').split(' ').includes(value);
};
// Invoke the `callback` every `frequency` ms until `element` fires one of the `events`.
export var repeatUntilEventOnElement = function repeatUntilEventOnElement(callback, frequency, element, events) {
  var handle = {
    active: true,
    count: 0,
    stop: stop
  };
  var timer = setInterval(function () {
    callback();
    handle.count += 1;
  }, frequency);

  function stop() {
    handle.active = false;
    clearInterval(timer);
    events.forEach(function (event) {
      element.removeEventListener(event, stop);
    });
  }

  events.forEach(function (event) {
    element.addEventListener(event, stop);
  });
  return handle;
};
/**
 * @param {HTMLElement} element
 * @return {Array} Every `window` containing this element, including any surrounding `<iframe>` (browser security model allowing)
 */

export var getIframeAwareSurroundingWindows = function getIframeAwareSurroundingWindows(element) {
  var results = [];
  var ancestorElement = element;

  while (ancestorElement) {
    var ancestorElementWindow = ancestorElement.ownerDocument.defaultView;
    results.push(ancestorElementWindow);
    ancestorElement = ancestorElementWindow.frameElement;
  }

  return results;
};

var getIframeAwareAncestorElement = function getIframeAwareAncestorElement(element) {
  return element.parentElement || element.ownerDocument.defaultView.frameElement;
};
/**
 * @param {HTMLElement} element
 * @return {Array} Every ancestor of this element, including ancestors of any surrounding `<iframe>` (browser security model allowing)
 */


export var getIframeAwareAncestorElements = function getIframeAwareAncestorElements(element) {
  var results = [];
  var ancestorElement = getIframeAwareAncestorElement(element);

  while (ancestorElement) {
    results.push(ancestorElement);
    ancestorElement = getIframeAwareAncestorElement(ancestorElement);
  }

  return results;
};
export var getIframeAwareClientRect = function getIframeAwareClientRect(element) {
  var elementRect = element.getBoundingClientRect();
  var iframe = element.ownerDocument.defaultView.frameElement;
  if (document === element.ownerDocument || !iframe) return elementRect;
  var iframeRect = getIframeAwareClientRect(iframe);
  return translateRect(elementRect, iframeRect.left, iframeRect.top);
};
/**
 * @param {HTMLElement} element
 * @param {?HTMLElement} container Another element, or `null` to get document-relative coordinates
 * @return {object} A rect that gives the position of `element` relative to `container`
 */

export var getRelativeRect = function getRelativeRect(element, container) {
  var elementRect = getIframeAwareClientRect(element);
  var xOrigin;
  var yOrigin;

  if (container && container.offsetParent) {
    var containerRect = getIframeAwareClientRect(container);
    xOrigin = containerRect.left;
    yOrigin = containerRect.top;
  } else {
    var _document$documentEle = document.documentElement,
        scrollLeft = _document$documentEle.scrollLeft,
        scrollTop = _document$documentEle.scrollTop;
    xOrigin = scrollLeft;
    yOrigin = scrollTop;
  }

  return translateRect(elementRect, xOrigin, yOrigin);
};