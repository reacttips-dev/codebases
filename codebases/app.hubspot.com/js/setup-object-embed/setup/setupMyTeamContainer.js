'use es6'; // The following disable directive for no-restricted-imports is intentional. We need to mport it for setup.
// eslint-disable-next-line no-restricted-imports

import GlobalMyTeamContainer from 'crm-legacy-global-containers/GlobalMyTeamContainer';
import MyTeamContainer from '../containers/MyTeamContainer';
export var setupMyTeamContainer = function setupMyTeamContainer(auth) {
  var user = auth.user;
  var myTeam = user.teams ? user.teams.find(function (team) {
    return team.my_team;
  }) : undefined;
  var teamId = myTeam && myTeam.id;
  MyTeamContainer.set(teamId);
  GlobalMyTeamContainer.setContainer(MyTeamContainer);
};