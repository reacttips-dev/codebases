// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { showFlag } = require('@trello/nachos/experimental-flags');
const Alerts = require('app/scripts/views/lib/alerts');
const { l } = require('app/scripts/lib/localize');
const { rpc } = require('app/scripts/network/rpc');

module.exports.alertSyncErrors = function () {
  let showConnectingTimeout = null;

  const showConnectFailed = () => {
    clearTimeout(showConnectingTimeout);
    Alerts.hide('connection');
    const msg = l('alerts.could not connect');
    showFlag({
      // Different area for connection dead to make it immune to race conditions
      id: 'connectionDead',
      title: msg,
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
  };

  rpc.on('connect_failed', showConnectFailed);
  rpc.on('reconnect_failed', showConnectFailed);

  const fxReconn = () => {
    clearTimeout(showConnectingTimeout);
    Alerts.hide('connection');
    return Alerts.hide('connectionDead');
  };
  const fxConn = () => {
    // Only show the "Connecting" alert if we've been disconnected for more
    // than 500ms. This should cut down on it flashing really briefly when you
    // have a flaky internet connection.
    clearTimeout(showConnectingTimeout);
    return (showConnectingTimeout = setTimeout(() => {
      showConnectingTimeout = null;
      showFlag({
        id: 'connection',
        title: l('alerts.reconnecting'),
        appearance: 'error',
        isUndismissable: true,
      });
    }, 500));
  };

  rpc.on('reconnect', fxReconn);
  return rpc.on('connecting', fxConn);
};
