// Shims mostly for DOM-y stuff because babel doesn't do that

// Copypasta from ZFGA
export const closest = () => {
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }

  if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      const el = this;
      let ancestor = this;
      if (!document.documentElement.contains(el)) {
        return null;
      }
      do {
        if (ancestor.matches(s)) {
          return ancestor;
        }
        ancestor = ancestor.parentElement;
      } while (typeof ancestor === 'object' && ancestor !== null);
      return null;
    };
  }
};

// https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove#Polyfill
export const remove = () => {
  (function(arr) {
    arr.forEach(item => {
      if (item.hasOwnProperty('remove')) {
        return;
      }
      Object.defineProperty(item, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
          this.parentNode.removeChild(this);
        }
      });
    });
  })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
};

export const customEvent = () => {
  if (typeof window.CustomEvent === 'function') {
    return false;
  }
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
};

const allShims = () => {
  closest();
  customEvent();
  remove();
};

export default allShims;
