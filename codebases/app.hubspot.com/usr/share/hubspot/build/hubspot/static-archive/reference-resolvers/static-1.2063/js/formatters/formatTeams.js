'use es6';

import { List, fromJS } from 'immutable';
import indexBy from 'transmute/indexBy';
import get from 'transmute/get';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';

var formatTeamId = function formatTeamId(team) {
  return String(team.id);
};

var formatTeamReference = function formatTeamReference(team) {
  return new ReferenceRecord({
    id: formatTeamId(team),
    label: team.name,
    referencedObject: fromJS(team)
  });
};

var formatTeams = function formatTeams(teams) {
  return indexBy(get('id'), List(teams).map(formatTeamReference));
};

export default formatTeams;