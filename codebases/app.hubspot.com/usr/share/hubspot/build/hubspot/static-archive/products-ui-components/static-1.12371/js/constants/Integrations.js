'use es6';

import keyMirror from 'react-utils/keyMirror';
export var INTEGRATION_SOURCES = keyMirror({
  HUBSPOT: null,
  SHOPIFY: null,
  ECOMM: null,
  ECOMM_API: null
});
/**
 * @deprecated
 */

export var INTEGRATION_IDENTIFIERS = {
  ECOMM: 'ip__ecomm_bridge__ecomm_synced'
};
export var PRODUCT_SHOPIFY_IDENTIFIER_PROPERTY = 'ip__shopify__vendor';
export var DEAL_SHOPIFY_IDENTIFIER_PROPERTY = 'ip__shopify__source_name';
export var LINE_ITEM_SHOPIFY_IDENTIFIER_PROPERTY = 'ip__shopify__title';
export var READABLE_INTEGRATION_SOURCES = {
  HUBSPOT: 'HubSpot'
};
/** Added for tracking ecomm usage: https://zenhub.hubteam.com/workspaces/cpq-5c5875806b243f914638f898/issues/hubspotprotected/settings-ui-products/698 */

export var SHOPIFY_APP_IDS = {
  QA: '1161155',
  PROD: '51381'
};
export var QUICKBOOKS_APP_IDS = {
  QA: '1165378',
  PROD: '188574'
};