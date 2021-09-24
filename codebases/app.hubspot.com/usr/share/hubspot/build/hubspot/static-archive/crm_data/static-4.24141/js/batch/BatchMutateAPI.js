'use es6';

import { DELETE } from 'crm_data/constants/HTTPVerbs';
import { isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
import BatchMutateLegacyClient from './clients/BatchMutateLegacyClient';
import BatchMutateClient from './clients/BatchMutateClient';
import { enforceIdList, enforceMethod, enforceProperties } from './validation'; // Use post() for full control, or update()/delete() for convenience.
// "query" can be a contactsSearch object or an array of IDs (numbers only)

var BatchMutateAPI = {
  post: function post(payload) {
    var objectType = payload.objectType;
    enforceIdList(payload);
    enforceMethod(payload);
    enforceProperties(payload);
    var client = isObjectTypeId(objectType) ? BatchMutateClient : BatchMutateLegacyClient;
    return client.post(payload);
  },
  update: function update(_ref) {
    var email = _ref.email,
        objectType = _ref.objectType,
        query = _ref.query,
        properties = _ref.properties,
        applyToAll = _ref.applyToAll,
        selectedCount = _ref.selectedCount;
    return BatchMutateAPI.post({
      email: email,
      objectType: objectType,
      query: query,
      properties: properties,
      method: 'UPDATE',
      applyToAll: applyToAll,
      expectedNumberObjectsModified: selectedCount
    });
  },
  delete: function _delete(_ref2) {
    var email = _ref2.email,
        objectType = _ref2.objectType,
        query = _ref2.query,
        applyToAll = _ref2.applyToAll,
        selectedCount = _ref2.selectedCount;
    return BatchMutateAPI.post({
      email: email,
      objectType: objectType,
      query: query,
      method: DELETE,
      applyToAll: applyToAll,
      expectedNumberObjectsModified: selectedCount
    });
  }
};
export default BatchMutateAPI;