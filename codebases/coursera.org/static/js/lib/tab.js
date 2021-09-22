/*!
 * the 'focusable' method is inspired (closely copied)
 * https://github.com/marklagendijk/jQuery.tabbable
 */

import $ from 'jquery';

function visible(element) {
  return (
    $.expr.filters.visible(element) &&
    !$(element)
      .parents()
      .addBack()
      .filter(function () {
        return $.css(this, 'visibility') === 'hidden';
      }).length
  );
}

/**
 * _focusable function, taken from jQuery UI Core
 * @param element
 * @returns {*}
 */
function _focusable(element) {
  let map;
  let mapName;
  let img;
  const nodeName = element.nodeName.toLowerCase();
  const isTabIndexNotNaN = !isNaN($.attr(element, 'tabindex'));

  if (nodeName === 'area') {
    map = element.parentNode;
    mapName = map.name;
    if (!element.href || !mapName || map.nodeName.toLowerCase() !== 'map') {
      return false;
    }
    img = $('img[usemap=#' + mapName + ']')[0];
    return !!img && visible(img);
  }

  if (/^(input|select|textarea|button|object)$/.test(nodeName)) {
    return !element.disabled && visible(element);
  } else if (nodeName === 'a') {
    return (element.href || isTabIndexNotNaN) && visible(element);
  } else {
    return isTabIndexNotNaN && visible(element);
  }
}

function focusable(element) {
  return _focusable(element, !isNaN($.attr(element, 'tabindex')));
}

function tabbable(element) {
  const tabIndex = $.attr(element, 'tabindex');
  const isTabIndexNaN = isNaN(tabIndex);

  return (isTabIndexNaN || tabIndex >= 0) && _focusable(element, !isTabIndexNaN);
}

function getNext(element) {
  let nextElement = element;
  while (nextElement) {
    nextElement = nextElement.nextSibling;
    if (nextElement && tabbable(nextElement)) {
      return nextElement;
    }
  }
  return null;
}

function getPrevious(element) {
  let prevElement = element;
  while (prevElement) {
    prevElement = prevElement.previousSibling;
    if (prevElement && tabbable(prevElement)) {
      return prevElement;
    }
  }
  return null;
}

export const isFocusable = focusable;
export const isTabbable = tabbable;
export { getNext, getPrevious };

export default {
  isFocusable,
  isTabbable,
  getNext,
  getPrevious,
};
