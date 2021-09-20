/* eslint-disable
    eqeqeq,
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
const $ = require('jquery');
const { l } = require('app/scripts/lib/localize');
const { Analytics } = require('@trello/atlassian-analytics');
const { showFlag } = require('@trello/nachos/experimental-flags');

let reportedError = false;

module.exports.syncError = function (err, { isUsingSocket, dateLastMessage }) {
  showFlag({
    id: 'modelSync',
    title: l(
      'alerts.you-have-been-disconnected-from-the-trello-server-for-too-long',
    ),
    appearance: 'error',
    actions: [
      {
        content: l('alerts.reload page'),
        onClick: () => window.location.reload(),
        type: 'button',
      },
    ],
    isUndismissable: true,
  });

  if (!reportedError) {
    reportedError = true;

    // We get back an error message that will contain something like
    // "ixSinceUpdate too high: 2 > 1 (...id...)"
    // "ixSinceUpdate too low. 1 < 2 (...id...)"
    const parts =
      /too (low|high)[.:]\s+(\d+)\s[<>]\s(\d+)/.exec(err.message) || [];
    const [, lowOrHigh, value1, value2] = Array.from(parts);

    Analytics.sendOperationalEvent({
      action: 'errored',
      actionSubject: 'syncError',
      source: `network:${isUsingSocket ? 'socket' : 'ajax'}`,
      attributes: {
        type: isUsingSocket ? 'socket' : 'ajax',
        queueLength:
          parts != null
            ? lowOrHigh === 'high'
              ? 'tooHigh'
              : 'tooLow'
            : 'unknown',
        delta:
          parts != null
            ? Math.abs(parseInt(value1, 10) - parseInt(value2, 10))
            : undefined,
      },
    });

    const timeSinceGoodConnection = Date.now() - (dateLastMessage || 0);

    $.ajax({
      url: '/test-connection',
      timeout: 3000,
    })
      .fail(() => {
        return Analytics.sendTrackEvent({
          action: 'errored',
          actionSubject: 'connectionSyncError',
          source: 'network:ajax',
          attributes: {
            type: 'unreachable',
            timeSinceGoodConnection: timeSinceGoodConnection,
          },
        });
      })
      .done(() => {
        return Analytics.sendTrackEvent({
          action: 'errored',
          actionSubject: 'connectionSyncError',
          source: 'network:ajax',
          attributes: {
            type: 'reachable',
            timeSinceGoodConnection: timeSinceGoodConnection,
          },
        });
      });
  }
};
