'use es6';

import './PropertiesService';
import { PROPERTIES } from '../actions/ActionNamespaces';
import { PROPERTIES_CREATE_STARTED, PROPERTIES_CREATE_FAILED, PROPERTIES_CREATE_SUCCEEDED } from '../actions/ActionTypes';
import dispatcher from 'dispatcher/dispatcher';
import getIn from 'transmute/getIn';
import { defineLazyKeyStore } from '../store/LazyKeyStore';
import isLegacyHubSpotObject from 'customer-data-objects/crmObject/isLegacyHubSpotObject';
import { isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
import { denormalizePropertyGroups } from 'crm_data/properties/PropertiesAPI';
var PropertiesStore = defineLazyKeyStore({
  namespace: PROPERTIES,
  idIsValid: function idIsValid(objectTypeOrId) {
    return isLegacyHubSpotObject(objectTypeOrId) || isObjectTypeId(objectTypeOrId);
  },
  serializeData: denormalizePropertyGroups,
  responseTransform: getIn(['properties']),
  unstable_enableCache: true
}).defineName('PropertiesStore').defineResponseTo([PROPERTIES_CREATE_STARTED, PROPERTIES_CREATE_SUCCEEDED], function (state, _ref) {
  var objectType = _ref.objectType,
      property = _ref.property;
  return state.setIn([objectType, property.name], property);
}).defineResponseTo(PROPERTIES_CREATE_FAILED, function (state, _ref2) {
  var objectType = _ref2.objectType,
      property = _ref2.property;
  return state.deleteIn([objectType, property.name]);
}).register(dispatcher);
export default PropertiesStore;