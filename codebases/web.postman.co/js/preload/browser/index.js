/* eslint-disable no-console */
/**
 * This is a Preload script that will be initialized before other scripts would start
 * for all window types (requester, runner and console)
 */
const common = require('../common'),
      IPC = require('./ipc');

const browserAPIs = {
  IPC
};
const sdk = Object.assign({}, common, browserAPIs);

// We need release channel available right from app init
// Having this in bootConfig would mean it's unavailable
// to helpers that run before the bootConfig init
// TODO : Make this a global function
window.RELEASE_CHANNEL = __WP_RELEASE_CHANNEL__;

window.pm = window.pm || {};
window.pm.sdk = sdk;

