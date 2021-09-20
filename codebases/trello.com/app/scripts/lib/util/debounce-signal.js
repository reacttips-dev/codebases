/* eslint-disable @trello/disallow-filenames */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Hearsay = require('hearsay');

module.exports.debounceSignal = (signal, delay) =>
  new Hearsay.ContinuousSignal(function (send) {
    let unsubscribe;
    let lastValue = signal.get();
    let lastSend = Date.now();
    send(lastValue);

    let nextUpdate = null;

    const sendNewValue = function (latest) {
      lastValue = latest;
      lastSend = Date.now();
      return send(latest);
    };

    if (delay > 0) {
      unsubscribe = signal.subscribe(function (latest) {
        clearTimeout(nextUpdate);
        // don't send same value twice in a row
        if (lastValue === latest) {
          return;
        }
        const remainingWait = delay - (Date.now() - lastSend);
        if (remainingWait <= 0) {
          return sendNewValue(latest);
        } else {
          return (nextUpdate = setTimeout(
            () => sendNewValue(latest),
            remainingWait,
          ));
        }
      });

      return function () {
        unsubscribe();
        return clearTimeout(nextUpdate);
      };
    } else {
      unsubscribe = signal.subscribe(function (latest) {
        cancelAnimationFrame(nextUpdate);
        return (nextUpdate = requestAnimationFrame(() => send(latest)));
      });

      return function () {
        unsubscribe();
        return cancelAnimationFrame(nextUpdate);
      };
    }
  });
