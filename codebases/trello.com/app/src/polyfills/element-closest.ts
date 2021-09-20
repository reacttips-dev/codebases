/*
 * Polyfill for Element.closest. Supports IE9+
 * From https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
 */
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (selector: string) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let el = this;
    if (
      document &&
      document.documentElement &&
      !document.documentElement.contains(el)
    ) {
      return null;
    }
    do {
      if (el.matches(selector)) {
        return el;
      }
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);

    return null;
  };
}
