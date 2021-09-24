'use es6';

import quickFetch from 'quick-fetch';
import http from 'hub-http/clients/apiClient';
import { logCallingError } from 'calling-error-reporting/report/error';
var MAX_SEARCH_RESULTS = 50;
export var searchForContactCallees = function searchForContactCallees(_ref) {
  var objectId = _ref.objectId,
      objectTypeId = _ref.objectTypeId,
      query = _ref.query;
  var url = "/twilio/v1/callee-search/" + objectTypeId + "/" + objectId + "/?query=" + query + "&maxResults=" + MAX_SEARCH_RESULTS;
  return http.get(url);
};
export var fetchSingleCalleeClient = function fetchSingleCalleeClient(_ref2) {
  var objectId = _ref2.objectId,
      objectTypeId = _ref2.objectTypeId;
  var url = "/twilio/v1/callees/hydrate-one/" + objectTypeId + "/" + objectId;
  return http.get(url);
};
export var fetchCallees = function fetchCallees(_ref3) {
  var objectId = _ref3.objectId,
      objectTypeId = _ref3.objectTypeId;
  var url = "/twilio/v1/callees/" + objectTypeId + "/" + objectId;
  return http.get(url);
};

function fetchCalleesEarlyRequest(_ref4) {
  var earlyRequester = _ref4.earlyRequester,
      requestName = _ref4.requestName,
      _ref4$requestParams = _ref4.requestParams,
      objectId = _ref4$requestParams.objectId,
      objectTypeId = _ref4$requestParams.objectTypeId;
  return new Promise(function (resolve, reject) {
    earlyRequester.whenFinished(function (response) {
      quickFetch.removeEarlyRequest(requestName);
      resolve(response);
    });
    earlyRequester.onError(function (request, error) {
      logCallingError({
        errorMessage: 'Callee Quick fetch failed.',
        extraData: {
          error: error,
          request: request,
          requestName: requestName
        },
        tags: {
          requestName: requestName
        }
      });
      quickFetch.removeEarlyRequest(requestName);
      reject(error);
    });
  }).catch(function () {
    /* Retry in case of the failed */
    return fetchCallees({
      objectId: objectId,
      objectTypeId: objectTypeId
    });
  });
}

export var fetchCalleesClient = function fetchCalleesClient(_ref5) {
  var objectTypeId = _ref5.objectTypeId,
      objectId = _ref5.objectId;
  var requestName = "callees_" + objectTypeId + "_" + objectId;
  var calleesEarlyRequest = quickFetch.getRequestStateByName(requestName);
  var promise;

  if (calleesEarlyRequest) {
    promise = fetchCalleesEarlyRequest({
      earlyRequester: calleesEarlyRequest,
      requestName: requestName,
      requestParams: {
        objectId: objectId,
        objectTypeId: objectTypeId
      }
    });
  } else {
    promise = fetchCallees({
      objectId: objectId,
      objectTypeId: objectTypeId
    });
  }

  return promise;
};