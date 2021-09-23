'use es6';

import { CANVA_GATE, CANVA_INTEGRATION_SCOPE, VIDEO_EXPERIMENTS_GATE, MARKETING_VIDEO_SCOPE, FILE_MANAGER_ACCESS, FILE_MANAGER_WRITE_SCOPE, SHUTTERSTOCK_MAINTENANCE_GATE, BYPASS_ELASTIC_SEARCH_GATE, FILE_HOSTING_PAID_DOMAINS_SCOPE, FREE_FILE_HOSTING_DOMAIN_GATE, FILE_HISTORY_GATE, PICKER_FIREALARM_GATE, SEARCHABLE_MOVE_MODAL_GATE, FUZZY_UNICODE_SEARCH_GATE, RECYCLE_BIN_GATE, PARTITIONING_GATE, VIDEO_MIGRATION_ALERT_GATE, PARTITIONING_SCOPE, SUPPRESS_SVG_DIMENSIONS_GATE_NAME, NEW_DETAILS_PANEL_GATE, HUBSPOT_VIDEO_2_GATE } from '../Constants';

var isUngated = function isUngated(state, gateName) {
  return state.auth.gates.includes(gateName);
};

var hasScope = function hasScope(state, scopeName) {
  return state.auth.user.scopes.includes(scopeName);
};

export var getHasCanvaIntegrationScope = function getHasCanvaIntegrationScope(state) {
  return state.auth.user.scopes.indexOf(CANVA_INTEGRATION_SCOPE) > -1;
};
export var getHasVideoIntegrationScope = function getHasVideoIntegrationScope(state) {
  return state.auth.user.scopes.indexOf(MARKETING_VIDEO_SCOPE) > -1;
};
export var getHasFileManagerAccessScope = function getHasFileManagerAccessScope(state) {
  return state.auth.user.scopes.indexOf(FILE_MANAGER_ACCESS) > -1;
};
export var getHasPartitioningScope = function getHasPartitioningScope(state) {
  return state.auth.user.scopes.indexOf(PARTITIONING_SCOPE) > -1;
};
export var getHasFileManagerWriteScope = function getHasFileManagerWriteScope(state) {
  return hasScope(state, FILE_MANAGER_WRITE_SCOPE);
};
export var getHasFileHostingPaidDomainsScope = function getHasFileHostingPaidDomainsScope(state) {
  return hasScope(state, FILE_HOSTING_PAID_DOMAINS_SCOPE);
};
export var getUserEmailAddress = function getUserEmailAddress(state) {
  return state.auth.user.email;
};
export var getUser = function getUser(state) {
  return state.auth.user;
};
export var getUserId = function getUserId(state) {
  return state.auth.user.user_id;
};
export var getTeams = function getTeams(state) {
  return state.auth.user.teams;
};
export var getIsUngatedForVideoExperiments = function getIsUngatedForVideoExperiments(state) {
  return isUngated(state, VIDEO_EXPERIMENTS_GATE);
};
export var getIsUngatedForCanva = function getIsUngatedForCanva(state) {
  return isUngated(state, CANVA_GATE);
};
export var getIsUngatedForShutterstockMaintenance = function getIsUngatedForShutterstockMaintenance(state) {
  return isUngated(state, SHUTTERSTOCK_MAINTENANCE_GATE);
};
export var getIsUngatedForBypassElasticSearch = function getIsUngatedForBypassElasticSearch(state) {
  return isUngated(state, BYPASS_ELASTIC_SEARCH_GATE);
};
export var getHasCustomFileHostingDomainAccess = function getHasCustomFileHostingDomainAccess(state) {
  return isUngated(state, FREE_FILE_HOSTING_DOMAIN_GATE) ? getHasFileHostingPaidDomainsScope(state) : true;
};
export var getIsUngatedForFileHistory = function getIsUngatedForFileHistory(state) {
  return isUngated(state, FILE_HISTORY_GATE);
};
export var getIsUngatedForPickerFireAlarm = function getIsUngatedForPickerFireAlarm(state) {
  return isUngated(state, PICKER_FIREALARM_GATE);
};
export var getIsUngatedForSearchableMoveModal = function getIsUngatedForSearchableMoveModal(state) {
  return isUngated(state, SEARCHABLE_MOVE_MODAL_GATE);
};
export var getIsUngatedForFuzzyUnicodeSearch = function getIsUngatedForFuzzyUnicodeSearch(state) {
  return isUngated(state, FUZZY_UNICODE_SEARCH_GATE);
};
export var getIsUngatedForRecycleBin = function getIsUngatedForRecycleBin(state) {
  return isUngated(state, RECYCLE_BIN_GATE);
};
export var getIsUngatedForPartitioning = function getIsUngatedForPartitioning(state) {
  return isUngated(state, PARTITIONING_GATE);
};
export var getIsUngatedForVideoAlertMigrationAlert = function getIsUngatedForVideoAlertMigrationAlert(state) {
  return isUngated(state, VIDEO_MIGRATION_ALERT_GATE);
};
export var getIsUngatedForSuppressSvgDimensions = function getIsUngatedForSuppressSvgDimensions(state) {
  return isUngated(state, SUPPRESS_SVG_DIMENSIONS_GATE_NAME);
};
export var getIsUngatedForNewDetailsPanel = function getIsUngatedForNewDetailsPanel(state) {
  return isUngated(state, NEW_DETAILS_PANEL_GATE);
};
export var getIsUngatedForHubSpotVideo2 = function getIsUngatedForHubSpotVideo2(state) {
  return isUngated(state, HUBSPOT_VIDEO_2_GATE);
};