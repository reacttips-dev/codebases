'use es6';

import quickFetch from 'quick-fetch';
/**
 * This function consumes a request name and a promise and returns a function that will
 * check for that requestName in quickFetch before calling the promise.
 * It implements faas's standard guidelines such as retrying on failure across all our
 * quickFetched requests.
 *
 * Note that regardless of whether or not it succeeds or fails, the request state is cleared.
 * This is to prevent the quickFetch-enhanced api files from returning stale data.
 *
 * @param {string} requestName - Whatever name you have given your request in your early requester
 * @param {(...params: any[]) => Promise<any>} request - The promise to be used when a quickFetched request is not available.
 * @returns {(...params: any[]) => Promise<any>} The enhanced function
 */

export var makeQuickFetchedRequest = function makeQuickFetchedRequest(requestName, request) {
  return function () {
    for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    var quickFetchedRequest = quickFetch.getRequestStateByName(requestName);
    return quickFetchedRequest ? new Promise(function (resolve, reject) {
      quickFetchedRequest.whenFinished(function (result) {
        quickFetch.removeEarlyRequest(requestName);
        resolve(result);
      });
      quickFetchedRequest.onError(function () {
        quickFetch.removeEarlyRequest(requestName);
        request.apply(void 0, params).then(resolve, reject);
      });
    }) : request.apply(void 0, params);
  };
};