'use es6';

import quickFetch from 'quick-fetch';
import { fromJS } from 'immutable';
import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
var BASE_URL = 'inbounddb-meta/v1'; // Copy this name when quick-fetching object type definitions

var QUICK_FETCH_NAME = 'object-type-definitions-fetch';

var removeRequest = function removeRequest() {
  return quickFetch.removeEarlyRequest(QUICK_FETCH_NAME);
};

export function fetchAllObjectTypes() {
  var quickFetchedRequest = quickFetch.getRequestStateByName(QUICK_FETCH_NAME);

  if (quickFetchedRequest) {
    return new Promise(function (resolve, reject) {
      quickFetchedRequest.whenFinished(function (result) {
        removeRequest();
        resolve(fromJS(result));
      });
      quickFetchedRequest.onError(function () {
        removeRequest();
        fetchAllObjectTypes().then(resolve, reject);
      });
    });
  }

  return ImmutableAPI.get(BASE_URL + "/object-types/for-portal");
}