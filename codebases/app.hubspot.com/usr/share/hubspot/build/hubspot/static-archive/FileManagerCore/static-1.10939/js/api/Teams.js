'use es6';

import { fromJS } from 'immutable';
import http from 'hub-http/clients/apiClient';
var BASE_URI = 'app-users/v1/teams';
export var fetchTeams = function fetchTeams() {
  return http.get(BASE_URI).then(fromJS);
};