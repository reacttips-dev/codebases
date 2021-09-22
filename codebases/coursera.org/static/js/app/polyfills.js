import q from 'q';
import 'whatwg-fetch';

if (typeof window !== 'undefined' && typeof window.Promise === 'undefined') {
  window.Promise = q.promise;
}

// Adapted from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
if (typeof CustomEvent !== 'undefined' && typeof CustomEvent !== 'function') {
  const customEvent = (event, params) => {
    const eventParams = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined,
    };
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(event, eventParams.bubbles, eventParams.cancelable, eventParams.detail);
    return e;
  };

  customEvent.prototype = Event.prototype;

  CustomEvent = customEvent; // eslint-disable-line no-native-reassign, no-undef
}

// Alternate names from http://caniuse.com/#feat=matchesselector
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
  const prototype = Element.prototype;
  prototype.matches =
    prototype.matchesSelector ||
    prototype.mozMatchesSelector ||
    prototype.msMatchesSelector ||
    prototype.oMatchesSelector ||
    prototype.webkitMatchesSelector;
}

// Polyfill the remove() method as IE does not support it
// https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
if (typeof Element !== 'undefined' && !Element.prototype.remove) {
  Object.defineProperty(Element, 'remove', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function remove() {
      this.parentNode.removeChild(this);
    },
  });
}

// Polyfill the forEach method for NodeList as IE does not support it
if (typeof window !== 'undefined' && window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, context) {
    // callback would take three arguments: currentValue, currentIndex, listObj
    context = context || window;
    const nodeList = this;
    for (let idx = 0; idx < nodeList.length; idx++) {
      callback.call(context, nodeList[idx], idx, nodeList);
    }
  };
}

// Element.closest() - https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
if (typeof Element !== 'undefined') {
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }

  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      let el = this;

      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }
}
