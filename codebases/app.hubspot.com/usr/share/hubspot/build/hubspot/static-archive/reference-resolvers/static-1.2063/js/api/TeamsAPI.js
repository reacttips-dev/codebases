'use es6';

import http from 'hub-http/clients/apiClient';
import formatTeams from 'reference-resolvers/formatters/formatTeams';
import formatHierarchicalTeams from 'reference-resolvers/formatters/formatHierarchicalTeams';
export var createGetAllTeams = function createGetAllTeams(_ref) {
  var httpClient = _ref.httpClient;
  return function () {
    return httpClient.get('app-users/v1/teams').then(formatTeams);
  };
};
export var getAllTeams = createGetAllTeams({
  httpClient: http
});
export var createGetAllHierarchicalTeams = function createGetAllHierarchicalTeams(_ref2) {
  var httpClient = _ref2.httpClient;
  return function () {
    return httpClient.get('app-users/v1/teams?includeHierarchy=true').then(formatHierarchicalTeams);
  };
};
export var getAllHierarchicalTeams = createGetAllHierarchicalTeams({
  httpClient: http
});
export var createGetHierarchicalTeamsByUser = function createGetHierarchicalTeamsByUser(_ref3) {
  var httpClient = _ref3.httpClient;
  return function () {
    return httpClient.get('app-users/v1/teams/user/all?includeHierarchy=true').then(formatHierarchicalTeams);
  };
};
export var getHierarchicalTeamsByUser = createGetHierarchicalTeamsByUser({
  httpClient: http
});