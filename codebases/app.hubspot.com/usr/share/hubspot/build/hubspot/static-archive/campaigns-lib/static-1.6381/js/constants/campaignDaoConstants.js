'use es6';

export var BASE_URL = 'campaigns/v1/campaigns';
export var CRM_SEARCH_CAMPAIGNS_URL = 'crm-search/search';
export var PAGE_DEFAULT_LIMIT = 30;
export var CAMPAIGN_DEFAULTS = {
  createdAt: 0,
  endedAt: 0,
  goals: {},
  notes: '',
  startedAt: 0
};
export var SORT_VALUES = {
  DISPLAY_NAME: 'DISPLAY_NAME',
  UTM: 'UTM',
  CREATED_AT: 'CREATED_AT',
  UPDATED_AT: 'UPDATED_AT'
};
export var SORT_DIR_VALUES = {
  ASC: 'ASC',
  DESC: 'DESC'
};
export var CRM_SEARCH_SORT_VALUES = {
  CREATED_AT: 'hs_created_at',
  UPDATED_AT: 'hs_origin_asset_updated_at',
  DISPLAY_NAME: 'hs_name'
};
export var CRM_SEARCH_CAMPAIGN_PROPERTIES = ['hs_color_hex', 'hs_origin_asset_id', 'hs_name', 'hs_utm'];
export var CRM_SEARCH_CAMPAIGN_PROPERTIES_FULL = ['hs_budget', 'hs_attribution_enabled', 'hs_audience', 'hs_color_hex', 'hs_created_at', 'hs_created_by_user_id', 'hs_end_date', 'hs_goal', // goals-start
'hs_session_goal', 'hs_new_contact_goal', 'hs_influenced_contact_goal', 'hs_influenced_closed_deal_goal', 'hs_influenced_revenue', // goals-end
'hs_origin_asset_id', 'hs_name', 'hs_notes', 'hs_object_id', 'hs_owner', 'hs_projected_budget', 'hs_revenue', 'hs_start_date', 'hs_origin_asset_updated_at', 'hs_template_guid', 'hs_utm', 'hs_utms'];
export var CRM_SEARCH_ERROR_OBJECT = {
  status: 404,
  requestFailed: 'crm-search'
};