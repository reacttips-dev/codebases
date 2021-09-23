'use es6';

import http from 'hub-http/clients/apiClient';
import { generatePath } from 'react-router-dom';
import { DELETE, UPDATE } from '../constants/UnifiedBatchMutationTypes';
export var BASE_URL = 'inbounddb-objects/v1/crm-objects';
export var BASE_URL_V2 = 'inbounddb-objects/v2/batch-mutation/dynamic-search';

var hasFilters = function hasFilters(filterGroups) {
  return Boolean(filterGroups.find(function (group) {
    return group.filters.length > 0;
  }));
};

export var deleteCrmObjectsByIds = function deleteCrmObjectsByIds(_ref) {
  var objectTypeId = _ref.objectTypeId,
      objectIds = _ref.objectIds;
  return http.delete(generatePath(BASE_URL + "/:objectTypeId", {
    objectTypeId: objectTypeId
  }), {
    data: objectIds,
    headers: {
      'x-properties-source': 'CRM_UI'
    }
  });
};
export var deleteCrmObjectsByIdsV2 = function deleteCrmObjectsByIdsV2(_ref2) {
  var objectTypeId = _ref2.objectTypeId,
      objectIds = _ref2.objectIds;
  return http.post(BASE_URL_V2, {
    data: {
      type: DELETE,
      objectTypeId: objectTypeId,
      objectIdList: objectIds
    },
    headers: {
      'x-properties-source': 'CRM_UI'
    }
  });
};
export var deleteCrmObjectsByFilters = function deleteCrmObjectsByFilters(_ref3) {
  var objectTypeId = _ref3.objectTypeId,
      filterGroups = _ref3.filterGroups,
      query = _ref3.query;
  return http.post(BASE_URL_V2, {
    data: {
      applyToAll: !query && !hasFilters(filterGroups),
      type: DELETE,
      objectTypeId: objectTypeId,
      crmSearchRequestProxyEgg: {
        filterGroups: filterGroups,
        objectTypeId: objectTypeId,
        query: query
      },
      headers: {
        'x-properties-source': 'CRM_UI'
      }
    }
  });
};
export var writeCrmObjectPropertiesByIds = function writeCrmObjectPropertiesByIds(_ref4) {
  var objectTypeId = _ref4.objectTypeId,
      objectIds = _ref4.objectIds,
      propertyValues = _ref4.propertyValues;
  return http.put(generatePath(BASE_URL + "/:objectTypeId", {
    objectTypeId: objectTypeId
  }), {
    data: objectIds.map(function (objectId) {
      return {
        objectId: objectId,
        propertyValues: propertyValues
      };
    }),
    headers: {
      'x-properties-source': 'CRM_UI'
    }
  });
};
export var writeCrmObjectPropertiesByIdsV2 = function writeCrmObjectPropertiesByIdsV2(_ref5) {
  var objectTypeId = _ref5.objectTypeId,
      objectIds = _ref5.objectIds,
      propertyValues = _ref5.propertyValues;
  return http.post(BASE_URL_V2, {
    data: {
      type: UPDATE,
      objectTypeId: objectTypeId,
      properties: propertyValues,
      objectIdList: objectIds
    },
    headers: {
      'x-properties-source': 'CRM_UI'
    }
  });
};
export var writeCrmObjectPropertiesByFilters = function writeCrmObjectPropertiesByFilters(_ref6) {
  var objectTypeId = _ref6.objectTypeId,
      propertyValues = _ref6.propertyValues,
      filterGroups = _ref6.filterGroups,
      query = _ref6.query;
  return http.post(BASE_URL_V2, {
    data: {
      applyToAll: !query && !hasFilters(filterGroups),
      type: UPDATE,
      objectTypeId: objectTypeId,
      properties: propertyValues,
      crmSearchRequestProxyEgg: {
        filterGroups: filterGroups,
        objectTypeId: objectTypeId,
        query: query
      },
      headers: {
        'x-properties-source': 'CRM_UI'
      }
    }
  });
};