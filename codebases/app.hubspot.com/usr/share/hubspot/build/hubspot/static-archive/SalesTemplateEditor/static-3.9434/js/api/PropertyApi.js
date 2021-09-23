'use es6';

import Raven from 'Raven';
import { Map as ImmutableMap, fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import { CONTACT_OBJECT_TYPE_ID, COMPANY_OBJECT_TYPE_ID, DEAL_OBJECT_TYPE_ID, TICKET_OBJECT_TYPE_ID } from '../constants/ObjectTypeIds';

var catchError = function catchError(errorName) {
  return function (err) {
    if (!err || err.status === 0) {
      return ImmutableMap();
    }

    Raven.captureMessage("[SalesTemplateEditor] " + errorName + " " + err.status, {
      extra: {
        err: err
      }
    });
    return ImmutableMap();
  };
};

var fetchPropertiesHelper = function fetchPropertiesHelper(_ref) {
  var objectTypeId = _ref.objectTypeId,
      tokenName = _ref.tokenName,
      _ref$filterFn = _ref.filterFn,
      filterFn = _ref$filterFn === void 0 ? function () {
    return true;
  } : _ref$filterFn;
  var url = "properties/v4/groups/" + objectTypeId;
  return apiClient.get(url, {
    query: {
      includeProperties: true
    }
  }).then(fromJS).then(function (response) {
    var groups = response.get('results');
    return groups.map(function (group) {
      return group.set('displayName', propertyLabelTranslator(group.get('displayName'))).update('properties', function (properties) {
        return properties.filter(filterFn).map(function (property) {
          return property.set('label', propertyLabelTranslator(property.get('label')));
        });
      });
    });
  }, catchError(tokenName + " properties fetch error"));
};

export default {
  fetchContactProperties: function fetchContactProperties() {
    return fetchPropertiesHelper({
      objectTypeId: CONTACT_OBJECT_TYPE_ID,
      tokenName: 'contact'
    });
  },
  fetchCompanyProperties: function fetchCompanyProperties() {
    return fetchPropertiesHelper({
      objectTypeId: COMPANY_OBJECT_TYPE_ID,
      tokenName: 'company',
      filterFn: function filterFn(property) {
        return property.get('name') !== 'hubspot_owner_id';
      }
    });
  },
  fetchDealProperties: function fetchDealProperties() {
    return fetchPropertiesHelper({
      objectTypeId: DEAL_OBJECT_TYPE_ID,
      tokenName: 'deal'
    });
  },
  fetchTicketProperties: function fetchTicketProperties() {
    return fetchPropertiesHelper({
      objectTypeId: TICKET_OBJECT_TYPE_ID,
      tokenName: 'ticket'
    });
  }
};