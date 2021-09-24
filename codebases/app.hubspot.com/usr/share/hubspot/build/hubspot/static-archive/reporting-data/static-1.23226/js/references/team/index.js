'use es6';

import I18n from 'I18n';
import { Map as ImmutableMap } from 'immutable';
import { bulkGet } from './teams';
import { makeOption } from '../Option';
import { DEFAULT_NULL_VALUES } from '../../constants/defaultNullValues';
export var generateTeamLabel = function generateTeamLabel(teamInfo, id) {
  return id === DEFAULT_NULL_VALUES.ENUMERATION || Number(id) === 0 ? I18n.text('reporting-data.missing.unassigned') : teamInfo.get('name', I18n.text('reporting-data.missing.unknown.team', {
    id: id
  }));
};
export default (function (ids) {
  return bulkGet(ids).then(function (remote) {
    return ids.reduce(function (options, key) {
      var numberKey = Number(key);
      return options.set(numberKey, makeOption(key, generateTeamLabel(ImmutableMap(remote.has(numberKey) ? {
        name: remote.getIn([numberKey, 'label'])
      } : {}), key)));
    }, ImmutableMap());
  });
});