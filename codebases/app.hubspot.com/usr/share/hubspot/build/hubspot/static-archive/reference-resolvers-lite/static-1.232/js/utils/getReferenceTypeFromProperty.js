'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _PropertyNameToRefere;

import { CALL_TYPE_ID, COMPANY_TYPE_ID, CONTACT_TYPE_ID, DEAL_TYPE_ID, ENGAGEMENT_TYPE_ID, LINE_ITEM_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import * as ReferenceTypes from 'reference-resolvers-lite/constants/ReferenceTypes';
/**
 * Commented out properties are those that we know have
 * externalOptions but the corresponding lite resolver
 * has not yet been built out
 */

var PropertyNameToReferenceType = (_PropertyNameToRefere = {}, _defineProperty(_PropertyNameToRefere, CALL_TYPE_ID, {// hs_call_disposition: ReferenceTypes.CALL_DISPOSITION,
}), _defineProperty(_PropertyNameToRefere, COMPANY_TYPE_ID, {
  lifecyclestage: ReferenceTypes.PIPELINE_STAGE // hs_analytics_first_touch_converting_campaign: ReferenceTypes.CAMPAIGN,
  // hs_analytics_last_touch_converting_campaign: ReferenceTypes.CAMPAIGN,

}), _defineProperty(_PropertyNameToRefere, CONTACT_TYPE_ID, {
  hs_persona: ReferenceTypes.PERSONA,
  lifecyclestage: ReferenceTypes.PIPELINE_STAGE,
  // associatedcompanyid: ReferenceTypes.COMPANY,
  // 'formSubmissions.formId': ReferenceTypes.FORM,
  // 'listMemberships.listId': ReferenceTypes.LIST,
  // hs_analytics_first_touch_converting_campaign: ReferenceTypes.CAMPAIGN,
  // hs_analytics_last_touch_converting_campaign: ReferenceTypes.CAMPAIGN,
  // salesforcecampaignids: ReferenceTypes.SALESFORCE_CAMPAIGN,
  hs_all_assigned_business_unit_ids: ReferenceTypes.BUSINESS_UNIT
}), _defineProperty(_PropertyNameToRefere, DEAL_TYPE_ID, {
  dealstage: ReferenceTypes.PIPELINE_STAGE,
  pipeline: ReferenceTypes.PIPELINE,
  deal_currency_code: ReferenceTypes.MULTI_CURRENCY_CURRENCY_CODE // 'engagement.ownerId': ReferenceTypes.OWNER,

}), _defineProperty(_PropertyNameToRefere, ENGAGEMENT_TYPE_ID, {
  // hs_activity_type: ReferenceTypes.ACTIVITY_TYPE,
  hs_at_mentioned_owner_ids: ReferenceTypes.OWNER // hs_created_by: ReferenceTypes.USER,
  // hs_call_disposition: ReferenceTypes.CALL_DISPOSITION,

}), _defineProperty(_PropertyNameToRefere, LINE_ITEM_TYPE_ID, {
  hs_line_item_currency_code: ReferenceTypes.MULTI_CURRENCY_CURRENCY_CODE
}), _defineProperty(_PropertyNameToRefere, TICKET_TYPE_ID, {}), _PropertyNameToRefere);
var CommonPropertiesToReferenceType = {
  // '_inbounddbio.importid_': <fill in reference type>,
  hs_persona: ReferenceTypes.PERSONA,
  // hs_all_accessible_team_ids: <fill in reference type>,
  hubspot_owner_id: ReferenceTypes.OWNER,
  hubspot_team_id: ReferenceTypes.TEAM,
  hs_pipeline: ReferenceTypes.PIPELINE,
  hs_pipeline_stage: ReferenceTypes.PIPELINE_STAGE // 'ilsListMemberships.listId': <fill in reference type>,
  // hs_created_by: ReferenceTypes.USER,
  // hs_created_by_user_id: ReferenceTypes.USER,
  // hs_updated_by_user_id: ReferenceTypes.USER,
  // hs_event_status: <fill in reference type>,
  // hs_app_id: <fill in reference type>,

};
/**
 * Preference order (highest to lowest):
 *  - Common override
 *  - PropertyName override
 *  - BE property definition (given by `referenceType` field)
 *
 * @param property      CRM property definition object
 * @param objectTypeId  Schemas Object Type ID in the form `metaTypeId-typeId`, i.e. 0-1
 * @returns             The ReferenceType string for use with
 * the a resolver in this library
 */

export var getReferenceTypeFromProperty = function getReferenceTypeFromProperty(property, objectTypeId) {
  var propertyDefinitionReferenceType = property ? property.externalOptionsReferenceType : null; // for backwards compatibility until all external
  // option reference types are backfilled, keep reading
  // the old field

  if (property && property.referencedObjectType) {
    propertyDefinitionReferenceType = property.referencedObjectType;
  }

  var propertyName = property ? property.name : null;
  var propertyIsHubspotDefined = property ? property.hubspotDefined : false;

  if (propertyDefinitionReferenceType) {
    return propertyDefinitionReferenceType;
  }

  var overrideReferenceTypeFields = PropertyNameToReferenceType[objectTypeId] || {};
  var overrideReferenceType = overrideReferenceTypeFields[propertyName];

  if (overrideReferenceType && propertyIsHubspotDefined) {
    return overrideReferenceType;
  }

  var commonOverrideReferenceType = CommonPropertiesToReferenceType[propertyName];

  if (commonOverrideReferenceType && propertyIsHubspotDefined) {
    return commonOverrideReferenceType;
  }

  return null;
};