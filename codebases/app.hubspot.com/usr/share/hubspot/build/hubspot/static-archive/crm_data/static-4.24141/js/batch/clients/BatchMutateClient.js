'use es6';

import invariant from 'react-utils/invariant';
import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import { isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
import { DELETE, PUT } from 'crm_data/constants/HTTPVerbs';

var enforceObjectType = function enforceObjectType(objectType) {
  invariant(isObjectTypeId(objectType), "BatchMutateClient: expected objectType to be a valid objectTypeId, got " + objectType);
};

var validate = function validate(_ref) {
  var objectType = _ref.objectType;
  enforceObjectType(objectType);
};

var buildPayload = function buildPayload(propertyValues, objectIdList) {
  return objectIdList.map(function (objectId) {
    return {
      objectId: objectId,
      propertyValues: propertyValues
    };
  });
};

export default {
  post: function post(_ref2) {
    var objectType = _ref2.objectType,
        method = _ref2.method,
        query = _ref2.query,
        properties = _ref2.properties,
        email = _ref2.email;
    validate({
      objectType: objectType
    });
    var payload = query;
    var type = DELETE;

    if (method === 'UPDATE') {
      payload = buildPayload(properties, query);
      type = PUT;
    }

    return ImmutableAPI.send({
      type: type,
      headers: {
        'X-Properties-Source': 'CRM_UI',
        'X-Properties-SourceId': email
      }
    }, "inbounddb-objects/v1/crm-objects/" + objectType, payload);
  }
};