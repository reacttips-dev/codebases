'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { CRM_OBJECTS } from 'crm_data/actions/ActionNamespaces';
import { fetch } from 'crm_data/crmObjects/CrmObjectAPI';
import { defineLazyKeyStore, registerLazyKeyService } from 'crm_data/store/LazyKeyStore';
import { CRM_OBJECTS_UPDATE_STARTED, CRM_OBJECTS_UPDATE_SUCCEEDED, CRM_OBJECTS_UPDATE_FAILED } from 'crm_data/actions/ActionTypes';
import toString from 'transmute/toString';
import { setProperty, getProperty } from 'customer-data-objects/model/ImmutableModel';
registerLazyKeyService({
  namespace: CRM_OBJECTS,
  fetch: fetch
});
export default defineLazyKeyStore({
  namespace: CRM_OBJECTS,
  idIsValid: function idIsValid(id) {
    return typeof id === 'string';
  },
  idTransform: toString
}).defineResponseTo([CRM_OBJECTS_UPDATE_STARTED, CRM_OBJECTS_UPDATE_SUCCEEDED], function (state, _ref) {
  var id = _ref.id,
      nextProperties = _ref.nextProperties;

  if (!state.has(id)) {
    return state;
  }

  return state.updateIn([id], function (crmObject) {
    return nextProperties.reduce(function (acc, value, name) {
      return setProperty(acc, name, value);
    }, crmObject);
  });
}).defineResponseTo(CRM_OBJECTS_UPDATE_FAILED, function (state, _ref2) {
  var id = _ref2.id,
      nextProperties = _ref2.nextProperties,
      properties = _ref2.properties;
  return state.updateIn([id], function (object) {
    return properties.reduce(function (acc, value, name) {
      if (nextProperties.get(name) !== getProperty(acc, name)) {
        return acc;
      }

      return setProperty(acc, name, value);
    }, object);
  });
}).defineName('CrmObjectStore').register(dispatcher);