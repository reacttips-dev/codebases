'use es6';

import { Set as ImmutableSet, Map as ImmutableMap, List } from 'immutable';
import indexBy from 'transmute/indexBy';
import get from 'transmute/get';
import { formatToReferencesList } from 'reference-resolvers/lib/formatReferences';
import pipe from 'transmute/pipe';
import reduce from 'transmute/reduce';

var flattenChildTeams = function flattenChildTeams(acc, team) {
  acc = acc.push(team);

  if (team.childTeams) {
    acc = reduce(acc, flattenChildTeams, team.childTeams);
  }

  return acc;
};

var formatTeams = function formatTeams(teams) {
  return ImmutableMap({
    all: pipe(formatToReferencesList({
      getId: get('id'),
      getLabel: get('name'),
      referencedObject: function referencedObject(value) {
        return ImmutableMap(value).update('userIds', ImmutableSet);
      }
    }), indexBy(get('id')))(teams),
    byId: pipe(reduce(List(), flattenChildTeams), formatToReferencesList({
      getId: get('id'),
      getLabel: get('name'),
      referencedObject: function referencedObject(value) {
        return ImmutableMap(value).update('userIds', ImmutableSet);
      }
    }), indexBy(get('id')))(teams)
  });
};

export default formatTeams;