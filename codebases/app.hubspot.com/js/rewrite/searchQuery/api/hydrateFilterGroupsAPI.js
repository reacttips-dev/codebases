'use es6';

import http from 'hub-http/clients/apiClient';
var BASE_URL = 'sales-views/v2/crm-search/hydrate-filter-groups';
export var hydrateFilterGroups = function hydrateFilterGroups(filterGroups) {
  return http.post(BASE_URL, {
    data: filterGroups
  });
};