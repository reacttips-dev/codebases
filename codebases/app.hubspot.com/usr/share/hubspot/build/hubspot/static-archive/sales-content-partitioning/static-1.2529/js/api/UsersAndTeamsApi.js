'use es6';

import { fromJS, Set as ImmutableSet } from 'immutable';
import formatName from 'I18n/utils/formatName';
import apiClient from 'hub-http/clients/apiClient';
import { hasTeamHierarchies } from 'sales-content-partitioning/lib/Permissions';

var fetchTeamHierarchy = function fetchTeamHierarchy() {
  return apiClient.get('app-users/v1/teams/hierarchy').then(function (teams) {
    return ImmutableSet(fromJS(teams));
  });
};

var fetchTeams = function fetchTeams() {
  return apiClient.get('app-users/v1/teams').then(function (teams) {
    return ImmutableSet(fromJS(teams));
  });
};

var fetchUsersForTeams = function fetchUsersForTeams() {
  return apiClient.get('users/v2/app/hub-users', {
    query: {
      active: true,
      visible: true
    }
  }).then(function (users) {
    return ImmutableSet(fromJS(users));
  }).then(function (usersForTeams) {
    return usersForTeams.map(function (user) {
      var _user$toObject = user.toObject(),
          email = _user$toObject.email,
          firstName = _user$toObject.firstName,
          lastName = _user$toObject.lastName;

      return user.set('fullName', formatName({
        firstName: firstName,
        lastName: lastName,
        email: email
      }));
    });
  });
};

export var fetchUsersAndTeams = function fetchUsersAndTeams(scopes) {
  return Promise.all([hasTeamHierarchies(scopes) ? fetchTeamHierarchy() : fetchTeams(), fetchUsersForTeams()]);
};