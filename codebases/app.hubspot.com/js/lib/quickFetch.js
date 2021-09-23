'use es6';

import quickFetch from 'quick-fetch';
export var quickFetchResponse = function quickFetchResponse(key) {
  var quickFetchRequest = quickFetch.getRequestStateByName(key);
  var result = null;

  if (quickFetchRequest) {
    result = new Promise(function (resolve, reject) {
      quickFetchRequest.whenFinished(function (qfResult) {
        resolve(qfResult);
        quickFetch.removeEarlyRequest(key);
      });
      quickFetchRequest.onError(function (err) {
        reject(err);
        quickFetch.removeEarlyRequest(key);
      });
    });
  }

  return result;
};