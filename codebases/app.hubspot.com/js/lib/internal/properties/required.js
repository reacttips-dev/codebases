'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _REQUIRED_PROPERTIES_;

import pipe from 'transmute/pipe';
import keySeq from 'transmute/keySeq';
import toJS from 'transmute/toJS';
import { getRequiredProperties, _getRequiredPropertiesFallback as fallback } from 'crm_data/crmObjectTypes/ObjectType';
import { CrmObjectTypeRecord, LegacyCrmObjectType } from 'crm_data/crmObjectTypes/CrmObjectTypeRecords';
import { getDefaultProperties } from './defaults';
import getObjectTypeDefinition from '../getObjectTypeDefinition';
import { COMPANY_TYPE_ID, CONTACT_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { unique } from '../../../utils/unique';
var getPropertyNames = pipe(keySeq, toJS);
/**
 * Allowlist of properties to always include for a given object type
 */

export var REQUIRED_PROPERTIES_BY_OBJECT_TYPE_ID = (_REQUIRED_PROPERTIES_ = {}, _defineProperty(_REQUIRED_PROPERTIES_, CONTACT_TYPE_ID, ['firstname', 'lastname', 'email', // both of these analytics keys are used to display each other
// see: https://git.hubteam.com/HubSpot/CRM/pull/24039/files#r1167989
'hs_analytics_source', 'hs_analytics_source_data_1', 'objectType', 'hubspot_owner_id', 'hs_all_owner_ids', 'hubspot_team_id', 'hs_all_team_ids', 'hs_all_accessible_team_ids', 'notes_last_updated']), _defineProperty(_REQUIRED_PROPERTIES_, COMPANY_TYPE_ID, ['name', 'domain', 'phone', 'website', 'hubspot_owner_id', 'hs_all_owner_ids', 'hubspot_team_id', 'hs_all_team_ids', 'hs_all_accessible_team_ids', 'notes_last_updated']), _defineProperty(_REQUIRED_PROPERTIES_, DEAL_TYPE_ID, [// Adapted from DealBoardSearchAPI's list of included properties:
'dealname', 'amount', 'amount_in_home_currency', 'description', 'pipeline', 'closedate', 'createdate', 'deal_currency_code', 'dealtype', 'dealstage', 'relatesTo', 'hubspot_owner_id', 'hs_all_owner_ids', 'hs_priority', 'hubspot_team_id', 'hs_all_team_ids', 'hs_all_accessible_team_ids', 'notes_last_updated', 'hs_num_associated_deal_splits']), _defineProperty(_REQUIRED_PROPERTIES_, TICKET_TYPE_ID, [// Adapted from TicketBoardSearchAPI's list of included properties:
'closed_date', 'content', 'createdate', 'hs_ticket_priority', 'hs_pipeline', 'hs_pipeline_stage', 'hubspot_owner_id', 'hs_all_owner_ids', 'hubspot_team_id', 'hs_all_team_ids', 'hs_all_accessible_team_ids', 'subject', 'hs_lastactivitydate']), _REQUIRED_PROPERTIES_);
getRequiredProperties.implementInherited(CrmObjectTypeRecord, function (objectType) {
  return getPropertyNames(getDefaultProperties(objectType));
});
getRequiredProperties.implementInherited(LegacyCrmObjectType, function (objectType) {
  var requiredProperties = REQUIRED_PROPERTIES_BY_OBJECT_TYPE_ID[objectType.objectTypeId];
  var properties = getDefaultProperties(objectType).toJS();
  return unique([].concat(_toConsumableArray(requiredProperties), _toConsumableArray(Object.keys(properties))));
});
getRequiredProperties.implement(String, function (objectType) {
  var maybeTypeDefinition = getObjectTypeDefinition(objectType);

  if (maybeTypeDefinition instanceof CrmObjectTypeRecord) {
    return getRequiredProperties(maybeTypeDefinition);
  }

  return fallback(objectType);
});
export { getRequiredProperties };