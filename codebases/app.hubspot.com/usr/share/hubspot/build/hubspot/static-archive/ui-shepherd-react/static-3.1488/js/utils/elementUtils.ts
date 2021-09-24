export var getAttachedElement = function getAttachedElement(attachTo) {
  if (typeof attachTo === 'string') {
    return document.querySelector(attachTo);
  } else if (typeof attachTo === 'function') {
    return attachTo();
  } // 'attachTo' is already an element


  return attachTo;
};
export var getBorderRadiusNumber = function getBorderRadiusNumber(element) {
  var _window$getComputedSt = window.getComputedStyle(element),
      borderRadius = _window$getComputedSt.borderRadius;

  if (/^\d+px$/.test(borderRadius)) {
    return parseInt(borderRadius, 10);
  }

  return undefined;
};
export var getScrollParent = function getScrollParent(element) {
  if (!element) {
    return null;
  }

  var isHtmlElement = element instanceof HTMLElement;

  var _ref = isHtmlElement && window.getComputedStyle(element) || {},
      overflowY = _ref.overflowY,
      position = _ref.position;

  var isScrollable = overflowY !== 'hidden' && overflowY !== 'visible';

  if (isScrollable && element.scrollHeight >= element.clientHeight) {
    return element;
  }

  if (position === 'fixed') {
    return null;
  }

  return getScrollParent(element.parentElement);
};
export var getVerticalPosition = function getVerticalPosition(element) {
  var elementRect = element.getBoundingClientRect();
  var top = elementRect.y || elementRect.top;
  var bottom = elementRect.bottom || top + elementRect.height;
  return {
    top: top,
    bottom: bottom
  };
};
export var getVisibleHeight = function getVisibleHeight(element, scrollParent) {
  var _getVerticalPosition = getVerticalPosition(element),
      top = _getVerticalPosition.top,
      bottom = _getVerticalPosition.bottom;

  if (scrollParent) {
    var parentPosition = getVerticalPosition(scrollParent);
    top = Math.max(top, parentPosition.top);
    bottom = Math.min(bottom, parentPosition.bottom);
  }

  var height = Math.max(bottom - top, 0); // Default to 0 if height is negative

  return {
    y: top,
    height: height
  };
};
export var getCurrentFrameElement = function getCurrentFrameElement(frameWindow) {
  var parentWidow = frameWindow.parent;
  var parentFrames = Array.from(parentWidow.frames.document.querySelectorAll('iframe')); // Get all frames in parent window and find the one that matches the frame window

  var frameElement = parentFrames.find(function (frame) {
    return frame.contentWindow === frameWindow;
  }) || null;
  return {
    frameElement: frameElement,
    parentWidow: parentWidow
  };
};
export var getCurrentFrameVisibleRect = function getCurrentFrameVisibleRect(targetElement) {
  var rect = {
    x: 0,
    y: 0
  }; // Get the window where the element is located

  var currentWindow = targetElement.ownerDocument.defaultView;

  while (currentWindow && currentWindow !== window) {
    // Get frame window corresponding frame element in parent window
    var _getCurrentFrameEleme = getCurrentFrameElement(currentWindow),
        frameElement = _getCurrentFrameEleme.frameElement,
        parentWidow = _getCurrentFrameEleme.parentWidow;

    if (!frameElement) {
      break;
    } // Accumulate the frame element position


    var frameRect = frameElement.getBoundingClientRect();
    rect.x += frameRect.x || frameRect.left;
    rect.y += frameRect.y;
    currentWindow = parentWidow;
  }

  return rect;
};
export var getBoundingVisibleRect = function getBoundingVisibleRect(targetElement, scrollParent, radius) {
  var _targetElement$getBou = targetElement.getBoundingClientRect(),
      x = _targetElement$getBou.x,
      width = _targetElement$getBou.width,
      left = _targetElement$getBou.left;

  var _getVisibleHeight = getVisibleHeight(targetElement, scrollParent),
      y = _getVisibleHeight.y,
      height = _getVisibleHeight.height; // Get absolute visible rect if current window is a frame


  var currentFrameRect = getCurrentFrameVisibleRect(targetElement); // getBoundingClientRect is not consistent.
  // Some browsers use x and y, while others use left and top

  return {
    width: width,
    height: height,
    x: (x || left) + currentFrameRect.x,
    y: y + currentFrameRect.y,
    r: radius
  };
};
export var getSpacedRect = function getSpacedRect(rect, padding) {
  var width = rect.width,
      height = rect.height,
      x = rect.x,
      y = rect.y,
      r = rect.r;
  return {
    width: width + padding * 2,
    height: height + padding * 2,
    x: x - padding,
    y: y - padding,
    r: r
  };
};
export var isElementVisible = function isElementVisible(element) {
  if (!element) {
    return false;
  }

  return Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
};