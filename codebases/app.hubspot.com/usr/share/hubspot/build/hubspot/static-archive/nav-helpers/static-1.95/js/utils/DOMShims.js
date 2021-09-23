'use es6';
/*
 * Not all browsers support HTMLElement,
 * This will feature detect and fallback to an estimation.
 */

export function isElement() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var hasHTMLElementSupport = HTMLElement && typeof HTMLElement === 'object';

  if (hasHTMLElementSupport) {
    return obj && obj instanceof HTMLElement;
  }

  return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
}
/*
 * Grabs element from DOM if it exists.
 * If it doesn't, then a new element is created.
 */

export function getOrCreateElement(id) {
  var element = document.getElementById(id);

  if (!element || !isElement(element)) {
    element = document.createElement('div');
    element.id = id;
  }

  return element;
}
/*
 * Element.insertAfter does not exist.
 * This functionality can be added by combining Element.insertBefore & Element.nextSibling.
 */

export function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
/*
 * Element.children is read only.
 * Children can only be modified via appension or removal.
 */

export function replaceChildren(parentNode) {
  var newChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.firstChild);
  }

  newChildren.forEach(function (child) {
    parentNode.appendChild(child);
  });
  return parentNode;
}