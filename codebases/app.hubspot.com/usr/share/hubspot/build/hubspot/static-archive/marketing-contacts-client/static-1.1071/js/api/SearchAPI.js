'use es6';

import http from 'hub-http/clients/apiClient';
import PortalIdParser from 'PortalIdParser';
export var fetchSearch = function fetchSearch(filterGroups, query) {
  return http.post("crm-search/search", {
    data: {
      portalId: PortalIdParser.get(),
      objectTypeId: 'CONTACT',
      count: 0,
      filterGroups: filterGroups,
      query: query
    }
  });
};
export var fetchReport = function fetchReport(properties, filterGroups, query) {
  if (!Array.isArray(properties)) {
    properties = [properties];
  }

  return http.post("crm-search/report", {
    data: {
      portalId: PortalIdParser.get(),
      objectTypeId: 'CONTACT',
      count: 0,
      aggregations: properties.map(function (property) {
        return {
          size: 500,
          property: property,
          type: 'TERMS',
          defaultNullValue: '@@MISSING@@'
        };
      }),
      filterGroups: filterGroups,
      query: query
    }
  });
};