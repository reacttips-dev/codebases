/* eslint-disable
    eqeqeq,
    @trello/disallow-filenames,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { CustomEvent } = require('./custom-event');

module.exports.triggerList = function (targets, eventName, options) {
  const event = new CustomEvent(eventName, {
    bubbles: false,
    cancelable: false,
    detail: options.detail != null ? options.detail : undefined,
  });

  let stopped = false;

  event.stopPropagation = function () {
    stopped = true;
    return CustomEvent.prototype.stopPropagation.apply(this, arguments);
  };

  for (const target of Array.from(targets)) {
    if (!stopped) {
      target.dispatchEvent(event);
    }
  }
};
