// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { ApiAjax } = require('app/scripts/network/api-ajax');
const Promise = require('bluebird');
const f = require('effing');
const assert = require('app/scripts/lib/assert');
const { ApiError } = require('app/scripts/network/api-error');

module.exports.ApiPromise = function (args) {
  assert(
    !('success' in args) && !('error' in args),
    'This is promise country!',
  );

  return Promise.fromNode(f(ApiAjax, args))
    .catch(function (...args1) {
      const [xhr] = Array.from(args1[0]);
      return Promise.reject(
        ApiError.fromResponse(xhr.status, xhr.responseText),
      );
    })
    .get(0);
};
