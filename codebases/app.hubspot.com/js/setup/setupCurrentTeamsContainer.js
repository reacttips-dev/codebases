'use es6'; // The following disable directive for no-restricted-imports is intentional. We need to mport it for setup.
// eslint-disable-next-line no-restricted-imports

import GlobalCurrentTeamsContainer from 'crm-legacy-global-containers/GlobalCurrentTeamsContainer';
import CurrentTeamsContainer from '../containers/CurrentTeamsContainer';
export var setupCurrentTeamsContainer = function setupCurrentTeamsContainer(auth) {
  var user = auth.user;
  var teams = user.teams ? user.teams.map(function (team) {
    return team.id;
  }) : [];
  CurrentTeamsContainer.set(teams);
  GlobalCurrentTeamsContainer.setContainer(CurrentTeamsContainer);
};