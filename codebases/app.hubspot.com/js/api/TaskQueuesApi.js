'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
export var API_URL = 'engagements/v1/queues';
export var fetchCurrentOwner = function fetchCurrentOwner() {
  return apiClient.get('owners/v2/owners/current').then(fromJS).then(function (response) {
    var owner = response.get('owner');

    if (!owner) {
      var jitaError = new Error("JITA'd users cannot fetch task queues because they are associated by ownerId");
      console.error(jitaError);
      throw jitaError;
    }

    return owner.get('ownerId');
  });
};