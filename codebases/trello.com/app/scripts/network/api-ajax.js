/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { ajaxQueue } = require('app/scripts/network/ajaxQueue');
const { Auth } = require('app/scripts/db/auth');
const { Util } = require('app/scripts/lib/util');
const Promise = require('bluebird');
const Queue = require('promise-queue');
const xtend = require('xtend');
const { Analytics } = require('@trello/atlassian-analytics');

const queue = new Queue(3);

const methodOf = function (opts) {
  let left;
  return ((left = opts.type != null ? opts.type : opts.method) != null
    ? left
    : 'GET'
  ).toUpperCase();
};

const performAjax = function (opts) {
  if (opts.data == null) {
    opts.data = {};
  }

  // The API requires two forms of authentication (cookie + body) for non-GET
  // requests (to mitigate CSRF attacks), but does not require them for GETs.
  if (methodOf(opts) !== 'GET') {
    opts.data.token = Auth.myToken();
  }

  // But it always expects invitationTokens to be there. This is expected to
  // change in the future, so that this is consistent with token. When that
  // happens, you know what to do.
  if (!opts.suppressInvitationTokens) {
    if (opts.data.invitationTokens == null) {
      opts.data.invitationTokens = Util.invitationTokens().join(',');
    }
  }

  // If it is flagged as a background operation that the user did not start,
  // then we do not want to warn about slow sending or break on possible
  // failures.
  if (opts.background) {
    ajaxQueue.send(opts);
    return;
  }

  // Dependency required at call site to avoid import cycles, do not lift to top of module
  const { ModelCache } = require('app/scripts/db/model-cache');
  if (opts.modelCache == null) {
    opts.modelCache = ModelCache;
  }
  ajaxQueue.ajax(opts);
};

module.exports.ApiAjax = (opts, next) =>
  queue
    .add(function () {
      const customSuccess = opts.success;
      const customError = opts.error;

      if (opts.headers == null) {
        opts.headers = {};
      }

      const traceId = opts.traceId;
      if (traceId) {
        opts.headers['X-Trello-TraceId'] = traceId;
      }

      return new Promise(function (resolve, reject) {
        opts = xtend(opts, {
          success(...args) {
            if (traceId && args && Array.isArray(args)) {
              const xhr = args[args.length - 1];
              if (
                xhr &&
                xhr.getResponseHeader &&
                xhr.getResponseHeader('X-Trello-Version')
              ) {
                const trelloServerVersion = xhr.getResponseHeader(
                  'X-Trello-Version',
                );
                Analytics.setTrelloServerVersion(traceId, trelloServerVersion);
              }
            }
            if (typeof customSuccess === 'function') {
              customSuccess(...Array.from(args || []));
            }
            resolve(args);
          },
          error(res, textStatus, error, fxDefault) {
            const trelloServerVersion = res.getResponseHeader(
              'X-Trello-Version',
            );
            Analytics.setTrelloServerVersion(traceId, trelloServerVersion);
            if (customError != null) {
              customError(res, textStatus, error, fxDefault);
            }
            reject([res, textStatus, error, fxDefault]);
          },
        });
        performAjax(opts);
      });
    })
    .nodeify(next)
    .catch(function () {})
    .done();
