'use es6';

import { fromJS, List, Map as ImmutableMap } from 'immutable';
import chunk from '../../lib/async/chunk';
import { Promise } from '../../lib/promise';
import toJS from '../../lib/toJS';
import * as http from '../../request/http';
import { makeOption } from '../Option';
import { hydrateFn, hydrateInputs } from './hydrate';

var extractInputs = function extractInputs(contactInfo) {
  var extracted = {};
  hydrateInputs.forEach(function (property) {
    extracted[property] = contactInfo.getIn(['properties', property, 'value']) || contactInfo.get(property);
  });
  return extracted;
};

var getDisplayName = function getDisplayName(contactInfo) {
  return hydrateFn(extractInputs(contactInfo));
};

var getContacts = function getContacts() {
  var contacts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
  return chunk(function (group) {
    return http.get('contacts/v3/contacts/batch', {
      query: {
        id: group.toArray(),
        properties: hydrateInputs
      }
    }).then(toJS);
  }, function (responses) {
    return responses.reduce(function (memo, response) {
      return Object.assign({}, memo, {}, response);
    }, {});
  }, contacts);
};

export var generateContactLabel = function generateContactLabel(contactInfo) {
  return getDisplayName(contactInfo);
};
export default (function (ids, transform) {
  if (ids.isEmpty()) {
    return Promise.resolve(ImmutableMap());
  }

  var sanitized = ids.reduce(function (memo, id) {
    var parsed = Number(id);
    return parsed ? memo.set(String(parsed), id) : memo;
  }, ImmutableMap());
  return getContacts(sanitized.keySeq().toList()).then(function (contacts) {
    return fromJS(contacts).reduce(function (options) {
      var contactInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableMap();
      var contactId = arguments.length > 2 ? arguments[2] : undefined;
      var option = makeOption(sanitized.get(contactId, contactId), getDisplayName(contactInfo));
      return options.set(String(contactId), transform ? transform(option, contactInfo) : option);
    }, ImmutableMap());
  });
});