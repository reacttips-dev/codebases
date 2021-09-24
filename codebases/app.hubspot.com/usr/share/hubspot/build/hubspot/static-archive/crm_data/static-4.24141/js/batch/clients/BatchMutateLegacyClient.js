'use es6';

import invariant from 'react-utils/invariant';
import isObject from 'transmute/isObject';
import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { CONTACTS } from 'customer-data-objects/property/PropertySourceTypes';
import { POST } from 'crm_data/constants/HTTPVerbs';
var _endpoints = {
  contacts: 'contacts/v1/mutation',
  companies: 'companies/v1/mutation',
  deals: 'deals/v1/mutation',
  tickets: 'services/v1/mutation'
};
_endpoints[CONTACT] = _endpoints.contacts;
_endpoints[COMPANY] = _endpoints.companies;
_endpoints[DEAL] = _endpoints.deals;
_endpoints[TICKET] = _endpoints.tickets;

var _getEndpoint = function _getEndpoint(type) {
  var objectTypes = Object.keys(_endpoints);
  invariant(objectTypes.includes(type), "expected type to be one of " + objectTypes + " but got " + type + " instead");
  return _endpoints[type];
};

export default {
  post: function post(_ref) {
    var objectType = _ref.objectType,
        method = _ref.method,
        query = _ref.query,
        properties = _ref.properties,
        applyToAll = _ref.applyToAll,
        expectedNumberObjectsModified = _ref.expectedNumberObjectsModified,
        email = _ref.email;
    var payload = {
      type: method,
      applyToAll: applyToAll
    };

    if (method === 'UPDATE') {
      payload.properties = properties;
    }

    if (Array.isArray(query)) {
      payload.objectIdList = query;
      payload.expectedNumberObjectsModified = expectedNumberObjectsModified;
    } else if (isObject(query)) {
      payload.contactsSearch = query;
      payload.expectedNumberObjectsModified = expectedNumberObjectsModified;
    }

    var endpoint = _getEndpoint(objectType);

    return ImmutableAPI.send({
      type: POST,
      headers: {
        'X-Properties-Source': objectType === CONTACT ? CONTACTS : 'CRM_UI',
        'X-Properties-SourceId': email
      }
    }, endpoint, payload);
  }
};