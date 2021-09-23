'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { toCrmObjectKey, fromCrmObjectKey } from 'customer-data-objects/crmObject/CrmObjectKey';
import User from 'hub-http-shims/UserDataJS/user';
import { CRM_UI } from 'customer-data-objects/property/PropertySourceTypes';
import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import invariant from 'react-utils/invariant';
import { List, Map as ImmutableMap } from 'immutable';
import { PUT } from 'crm_data/constants/HTTPVerbs';
import CrmObjectRecord from 'customer-data-objects/crmObject/CrmObjectRecord';
var BASE_URI = 'inbounddb-objects/v1/crm-objects';

var parseKeys = function parseKeys(keys) {
  return keys.reduce(function (acc, id) {
    var _fromCrmObjectKey = fromCrmObjectKey(id),
        objectId = _fromCrmObjectKey.objectId,
        objectTypeId = _fromCrmObjectKey.objectTypeId;

    var isValidKey = acc.objectTypeId === undefined || objectTypeId === acc.objectTypeId;
    invariant(isValidKey, 'CrmObjectAPI: All keys must have the same objectTypeId');
    return {
      ids: [].concat(_toConsumableArray(acc.ids), [objectId]),
      objectTypeId: objectTypeId
    };
  }, {
    ids: [],
    objectTypeId: undefined
  });
};

var parseItems = function parseItems(result) {
  return result.mapEntries(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        objectId = _ref2[0],
        object = _ref2[1];

    return [toCrmObjectKey({
      objectId: objectId,
      objectTypeId: object.get('objectTypeId')
    }), CrmObjectRecord.fromJS(object)];
  });
};

export var fetch = function fetch(keys) {
  invariant(List.isList(keys), 'CrmObjectAPI: expected keys to be a List but got %s', keys); // Bail out early if there are no ids because we can't make the request URL

  if (keys.isEmpty()) {
    return Promise.resolve(ImmutableMap());
  }

  var _parseKeys = parseKeys(keys),
      ids = _parseKeys.ids,
      objectTypeId = _parseKeys.objectTypeId;

  var query = {
    id: ids,
    allPropertiesFetchMode: 'latest_version'
  };
  return ImmutableAPI.get(BASE_URI + "/" + encodeURIComponent(objectTypeId) + "/batch", query).then(parseItems).catch(function (error) {
    if (error.status === 400 && error.responseJSON && error.responseJSON.message.includes('unknown objectTypeId')) {
      // The `inbounddb-objects/v1/crm-objects/{objectType}/batch` endpoint returns a
      // 400 instead an empty result if the object type doesn't exist. We want to
      // treat non-existent object types and object ids identically, as an empty result,
      // rather than throwing an error
      return ImmutableMap();
    }

    throw error;
  });
};
export function deleteObject(objectTypeId, objectId) {
  return ImmutableAPI.delete(BASE_URI + "/" + encodeURIComponent(objectTypeId) + "/" + encodeURIComponent(objectId));
}
export function updateCrmObjectProperties(crmObject, propertyUpdates) {
  var objectId = crmObject.get('objectId');
  var objectTypeId = crmObject.get('objectTypeId');
  return ImmutableAPI.send({
    headers: {
      'X-Properties-SourceId': CRM_UI
    },
    type: PUT
  }, BASE_URI + "/" + encodeURIComponent(objectTypeId) + "/" + encodeURIComponent(objectId) + "?allPropertiesFetchMode=latest_version", [propertyUpdates.reduce(function (acc, value, name) {
    acc.push({
      name: name,
      value: value,
      source: CRM_UI,
      sourceId: User.get().get('email')
    });
    return acc;
  }, [])], CrmObjectRecord.fromJS);
}