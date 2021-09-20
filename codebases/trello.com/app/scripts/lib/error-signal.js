/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const Hearsay = require('hearsay');
const Promise = require('bluebird');
const assert = require('app/scripts/lib/assert');
const config = require('@trello/config');

const errorSignal = new Hearsay.Emitter();
errorSignal.use();

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class ErrorInfo {
  constructor(error, url, line, col) {
    this.error = error;
    if (url == null) {
      url = document.location.href;
    }
    this.url = url;
    if (line == null) {
      line = 0;
    }
    this.line = line;
    if (col == null) {
      col = 0;
    }
    this.col = col;
    assert(this.error != null);
  }
}

window.onerror = function (msg, url, line, col, error) {
  if (error == null) {
    error = new Error(msg);
  }
  return errorSignal.send(new ErrorInfo(error, url, line, col));
};

Promise.onPossiblyUnhandledRejection(function (error) {
  // Make sure this lands in the browser console if the
  // member is not on the stable channel or are running locally
  const channels = __guard__(Auth.me(), (x) => x.get('channels'));
  const shouldPrintRejection =
    (channels != null ? channels.active : undefined) !== 'stable' ||
    (channels != null ? channels.dev : undefined) ||
    config.clientVersion === 'dev-0';

  if (shouldPrintRejection) {
    if (typeof console !== 'undefined' && console !== null) {
      console.warn('Possibly Unhandled Rejection:', error.message);
    }
    if (typeof console !== 'undefined' && console !== null) {
      console.error(error.stack);
    }
  }

  return errorSignal.send(new ErrorInfo(error));
});

module.exports.errorSignal = errorSignal;
