'use es6';

import UserContainer from 'SequencesUI/data/UserContainer';
export var getUserId = function getUserId() {
  return UserContainer.get().user_id;
};
export var getTeamId = function getTeamId() {
  var _UserContainer$get = UserContainer.get(),
      teams = _UserContainer$get.teams;

  var team = teams && teams[0];
  return team ? team.id : null;
};
export var getTeamIds = function getTeamIds() {
  var _UserContainer$get2 = UserContainer.get(),
      teams = _UserContainer$get2.teams;

  return teams.length ? teams.map(function (team) {
    return team.id;
  }) : null;
};