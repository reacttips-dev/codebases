'use es6';

import http from 'hub-http/clients/apiClient';
var BASE_URL = 'app-users/v1/teams';
export var fetchTeams = function fetchTeams() {
  return http.get(BASE_URL);
};