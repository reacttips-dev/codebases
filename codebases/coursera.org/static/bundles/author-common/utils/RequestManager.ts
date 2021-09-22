/**
 * Manage all API requests so that at most one is pending at any time.
 * If multiple requests are made while a request is pending,
 * only the most recent will be executed.
 * [fe-tech-debt] convert this to a class for better type safety and best practice
 */
import _ from 'lodash';

import Q from 'q';

const RequestManager = function (delay?: number) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._debouncedRun = _.debounce(this.run, delay || 500);
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._inProgress = false;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._pendingRequest = null;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._deferred = null;
};

RequestManager.prototype.run = function (request: $TSFixMe) {
  if (this._inProgress) {
    this._pendingRequest = request;
    return false;
  }

  const currentDeferred = this._deferred || Q.defer();
  this._deferred = null;
  this._inProgress = true;
  this._pendingRequest = null;

  request()
    .then((...args: $TSFixMe[]) => currentDeferred.resolve(...args))
    .catch((...args: $TSFixMe[]) => currentDeferred.reject(...args))
    .finally(() => {
      this._inProgress = false;

      if (this._pendingRequest) {
        this.run(this._pendingRequest);
      }
    })
    .done();

  return currentDeferred.promise;
};

RequestManager.prototype.debouncedRun = function (request: $TSFixMe) {
  if (!this._deferred) {
    this._deferred = Q.defer();
  }

  this._debouncedRun(request);

  return this._deferred.promise;
};

export default RequestManager;
