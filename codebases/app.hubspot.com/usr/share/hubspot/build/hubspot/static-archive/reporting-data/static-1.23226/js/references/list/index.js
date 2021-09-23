'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { fromJS, Map as ImmutableMap } from 'immutable';
import { GLOBAL_NULL } from '../../constants/defaultNullValues';
import chunk from '../../lib/async/chunk';
import prefix from '../../lib/prefix';
import toJS from '../../lib/toJS';
import * as http from '../../request/http';
import { validNumerical } from '../ids';
import { makeOption } from '../Option';
var translate = prefix('reporting-data.properties.contacts');
export var generateListMembershipIdLabel = function generateListMembershipIdLabel(list, key) {
  var immutableList = fromJS(list);
  return immutableList.get('name', key === GLOBAL_NULL ? null : translate('deletedList', {
    listId: immutableList.get('listId') || key
  }));
};

var batch = function batch(ids) {
  return chunk(function (group) {
    return http.get('contacts/v1/lists/batch', {
      query: {
        property: ['listId', 'name'],
        listId: validNumerical(group).toArray()
      }
    }).then(toJS);
  }, function (responses) {
    return responses.reduce(function (memo, _ref) {
      var lists = _ref.lists;
      return Object.assign({}, memo, {}, lists.reduce(function (mapped, list) {
        return Object.assign({}, mapped, _defineProperty({}, list.listId, generateListMembershipIdLabel(list)));
      }, {}));
    }, {});
  }, ids);
};

export default (function (ids) {
  return batch(ids).then(function (lists) {
    return ids.reduce(function (options, listId) {
      return options.set(String(listId), makeOption(listId, lists[listId]));
    }, ImmutableMap());
  });
});