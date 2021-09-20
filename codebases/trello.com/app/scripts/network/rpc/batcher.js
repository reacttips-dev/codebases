/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { ApiError } = require('app/scripts/network/api-error');
const customError = require('@atlassian/trello-error-ext');
const f = require('effing');
const assert = require('app/scripts/lib/assert');
const BluebirdPromise = require('bluebird');
const _ = require('underscore');
const { Util } = require('app/scripts/lib/util');

class Batcher {
  static initClass() {
    this.BatchFailure = customError('Batcher::BatchFailure');

    this.prototype._sent = false;
  }

  constructor({ headers } = {}) {
    this._headers = headers;
    this._requests = [];
  }

  request(url) {
    assert(!this._sent, 'Cannot add requests to a batcher after sending!');
    return new BluebirdPromise((resolve, reject) => {
      return this._requests.push({ url, resolve, reject });
    });
  }

  send() {
    assert(!this._sent, 'Cannot send more than once!');
    this._sent = true;

    const urls = this._requests.map(f.get('url')).join(',');
    let request = null;

    return new BluebirdPromise((outerResolve, outerReject) => {
      const data = { urls };

      // Add invitationTokens as a query param if they exist
      const invitationTokens = Util.invitationTokens().join(',');
      if (invitationTokens) {
        data.invitationTokens = invitationTokens;
      }

      return (request = $.ajax({
        data,
        headers: this._headers,
        url: '/1/batch',
        success: (data, textStatus, jqxhr) => {
          for (const [response, { resolve, reject }] of Array.from(
            _.zip(data, this._requests),
          )) {
            if ('200' in response) {
              resolve(response['200']);
            } else {
              reject(
                ApiError.fromResponse(response.statusCode, response.message),
              );
            }
          }
          // Because jqxhr thinks it's then-able, we can't
          // resolve to it directly.
          return outerResolve({ jqxhr });
        },
        error: (xhr) => {
          const errorMessage = ApiError.parseErrorMessage(xhr);
          const error = ApiError.fromResponse(xhr.status, errorMessage);
          for (const { reject } of Array.from(this._requests)) {
            reject(Batcher.BatchFailure('Batch request failed.', { error }));
          }
          return outerReject(error);
        },
      }));
    })
      .cancellable()
      .catch(BluebirdPromise.CancellationError, function (e) {
        request.abort();
        throw e;
      });
  }
}
Batcher.initClass();
module.exports.Batcher = Batcher;
