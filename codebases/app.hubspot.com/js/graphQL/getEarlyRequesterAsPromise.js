'use es6';

import quickFetch from 'quick-fetch';
export var getEarlyRequesterAsPromise = function getEarlyRequesterAsPromise(name) {
  var earlyGraphQLRequest = quickFetch.getRequestStateByName(name);
  if (!earlyGraphQLRequest) return null;
  return new Promise(function (resolve, reject) {
    earlyGraphQLRequest.whenFinished(function (result) {
      resolve(result);
      quickFetch.removeEarlyRequest(name);
    });
    earlyGraphQLRequest.onError(function () {
      reject(earlyGraphQLRequest.request);
      quickFetch.removeEarlyRequest(name);
    });
  });
};