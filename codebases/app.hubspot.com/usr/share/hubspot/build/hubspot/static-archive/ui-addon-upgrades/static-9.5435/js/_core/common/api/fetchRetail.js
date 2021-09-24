'use es6';

import http from 'hub-http/clients/apiClient';
import { getFullUrl } from 'hubspot-url-utils';
import { HAS_RETAIL_OVERRIDE } from 'ui-addon-upgrades/_core/utils/commMethodOverrides';
export var getIsRetailPortal = function getIsRetailPortal() {
  if (HAS_RETAIL_OVERRIDE) {
    return Promise.resolve(true);
  }

  return http.get(getFullUrl('api') + "/eligibility-engine/v2/retail");
};