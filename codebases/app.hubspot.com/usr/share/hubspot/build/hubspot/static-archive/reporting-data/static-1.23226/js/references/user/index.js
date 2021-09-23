'use es6';

import * as http from '../../request/http';
import { Map as ImmutableMap, fromJS } from 'immutable';
import { makeOption } from '../Option';
import I18n from 'I18n';
import formatName from 'I18n/utils/formatName';
import toJS from '../../lib/toJS';
import { DEFAULT_NULL_VALUES } from '../../constants/defaultNullValues';
var url = 'users/v2/app/hub-users/bulk';

var getDefaultOptions = function getDefaultOptions() {
  return ImmutableMap({
    0: makeOption(0, I18n.text('reporting-data.missing.unknown.user'))
  });
};

export var generateUserLabel = function generateUserLabel(user, key) {
  if (!user || key === DEFAULT_NULL_VALUES.ENUMERATION) {
    return I18n.text('reporting-data.missing.unknown.user');
  }

  user = fromJS(user);

  if (!user.has('firstName') && !user.has('lastName') & !user.has('email')) {
    return I18n.text('reporting-data.missing.unknown.user');
  }

  return formatName(user.toJS());
};
export default (function (ids) {
  var queryIds = ids.map(Number).filter(function (val) {
    return !!val;
  });

  if (queryIds.length === 0) {
    return Promise.resolve(getDefaultOptions());
  }

  return http.put(url, {
    data: queryIds,
    query: {
      limit: queryIds.length
    }
  }).then(toJS).then(function (_ref) {
    var userBriefs = _ref.userBriefs;
    return queryIds.reduce(function (collect, queryId) {
      var user = userBriefs.find(function (userBrief) {
        return userBrief.id === queryId;
      });
      var name = generateUserLabel(user);
      return collect.set(queryId, makeOption(queryId, name));
    }, getDefaultOptions());
  });
});