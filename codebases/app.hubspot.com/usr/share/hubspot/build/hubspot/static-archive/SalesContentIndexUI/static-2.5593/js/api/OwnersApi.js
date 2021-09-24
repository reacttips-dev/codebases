'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
import * as FilterTypes from 'SalesContentIndexUI/data/lib/FilterTypes';
var OWNER_LIMIT = 50;
var TEAM_LIMIT = 10; // Teams can have nested teams so the limit is lower

export function fetchOwnersAndTeams(contentType) {
  var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var selectedId = arguments.length > 2 ? arguments[2] : undefined;
  var selectedType = arguments.length > 3 ? arguments[3] : undefined;
  return apiClient.post('salescontentsearch/v2/search/owners', {
    data: {
      contentTypes: [contentType],
      ownerLimit: OWNER_LIMIT,
      query: query,
      selectedOwnerId: selectedType === FilterTypes.USER ? selectedId : null,
      selectedTeamId: selectedType === FilterTypes.TEAM ? selectedId : null
    }
  }).then(function (response) {
    var ownersAndTeams = fromJS(response);
    ownersAndTeams = ownersAndTeams.set('teams', ownersAndTeams.get('teams').take(TEAM_LIMIT));

    if (selectedType === FilterTypes.USER && ownersAndTeams.get('selectedOwner')) {
      ownersAndTeams = ownersAndTeams.set('owners', ownersAndTeams.get('owners').toSet().add(ownersAndTeams.get('selectedOwner')));
    } else if (selectedType === FilterTypes.TEAM && ownersAndTeams.get('selectedTeam')) {
      ownersAndTeams = ownersAndTeams.set('teams', ownersAndTeams.get('teams').toSet().add(ownersAndTeams.get('selectedTeam')));
    }

    return ownersAndTeams.toJS();
  });
}