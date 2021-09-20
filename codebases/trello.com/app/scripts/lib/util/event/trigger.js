/* eslint-disable
    eqeqeq,
    @trello/disallow-filenames,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { CustomEvent } = require('./custom-event');

module.exports.trigger = function (target, eventName, options) {
  if (options == null) {
    options = {};
  }
  const event = new CustomEvent(eventName, {
    bubbles: options.bubbles != null ? options.bubbles : true,
    cancelable: options.cancelable != null ? options.cancelable : false,
    detail: options.detail != null ? options.detail : undefined,
  });

  return target.dispatchEvent(event);
};
