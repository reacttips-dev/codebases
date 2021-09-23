'use es6';

import { Map as ImmutableMap } from 'immutable';
import toJS from '../../lib/toJS';
import * as http from '../../request/http';
import { validNumerical } from '../ids';
import { makeOption } from '../Option';
export var get = function get() {
  return http.get('app-users/v1/teams').then(toJS);
};
export var bulkGet = function bulkGet(ids) {
  return http.put('app-users/v1/teams/bulk-get', {
    data: validNumerical(ids)
  }).then(function (teams) {
    return teams.reduce(function (options, team) {
      return options.set(team.get('id'), makeOption(team.get('id'), team.get('name')));
    }, ImmutableMap());
  });
};