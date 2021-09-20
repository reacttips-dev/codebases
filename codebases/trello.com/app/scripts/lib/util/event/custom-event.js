/* eslint-disable
    eqeqeq,
    @trello/disallow-filenames,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// See if we can create CustomEvents, if not use a polyfill
module.exports.CustomEvent = (() => {
  try {
    new window.CustomEvent('testEvent');
    return window.CustomEvent;
  } catch (error) {
    // Adapted from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
    const CustomEventPolyfill = function (event, options) {
      if (options == null) {
        options = { bubbles: false, cancelable: false, detail: undefined };
      }
      const evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(
        event,
        options.bubbles,
        options.cancelable,
        options.detail,
      );
      return evt;
    };

    CustomEventPolyfill.prototype = window.Event.prototype;

    return CustomEventPolyfill;
  }
})();
