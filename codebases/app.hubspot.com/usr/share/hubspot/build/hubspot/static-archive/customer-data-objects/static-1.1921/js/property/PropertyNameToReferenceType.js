'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _CALL_TYPE_ID$COMPANY;

import * as ExternalOptionTypes from 'customer-data-objects/property/ExternalOptionTypes';
import * as OptionTypes from 'customer-data-objects/property/OptionTypes';
import { COMPANY, CONTACT, DEAL, ENGAGEMENT, LINE_ITEM, QUOTE, TICKET, VISIT } from 'customer-data-objects/constants/ObjectTypes';
import { CALL_TYPE_ID } from '../constants/ObjectTypeIds';
export default (_CALL_TYPE_ID$COMPANY = {}, _defineProperty(_CALL_TYPE_ID$COMPANY, CALL_TYPE_ID, {
  hs_call_disposition: ExternalOptionTypes.CALL_DISPOSITION,
  hs_created_by: ExternalOptionTypes.USER,
  hs_created_by_user_id: ExternalOptionTypes.USER,
  hs_updated_by_user_id: ExternalOptionTypes.USER
}), _defineProperty(_CALL_TYPE_ID$COMPANY, COMPANY, {
  '_inbounddbio.importid_': ExternalOptionTypes.INBOUND_DB_IMPORT,
  'ilsListMemberships.listId': ExternalOptionTypes.INBOUND_DB_LIST,
  hs_analytics_first_touch_converting_campaign: ExternalOptionTypes.CAMPAIGN,
  hs_analytics_last_touch_converting_campaign: ExternalOptionTypes.CAMPAIGN,
  hs_persona: ExternalOptionTypes.PERSONA,
  hubspot_owner_id: ExternalOptionTypes.OWNER,
  hubspot_team_id: ExternalOptionTypes.TEAM,
  hs_all_accessible_team_ids: ExternalOptionTypes.TEAM,
  // this property is used for critsit2021 remediation to identify affected workflows: #critsit-20210422-unexpected-workflow-enrolment
  hs_support_workflows_april_2021: ExternalOptionTypes.AUTOMATION_PLATFORM_WORKFLOWS
}), _defineProperty(_CALL_TYPE_ID$COMPANY, CONTACT, {
  associatedcompanyid: ExternalOptionTypes.COMPANY,
  '_inbounddbio.importid_': ExternalOptionTypes.INBOUND_DB_IMPORT,
  'formSubmissions.formId': ExternalOptionTypes.FORM,
  'listMemberships.listId': ExternalOptionTypes.LIST,
  'ilsListMemberships.listId': ExternalOptionTypes.INBOUND_DB_LIST,
  hs_analytics_first_touch_converting_campaign: ExternalOptionTypes.CAMPAIGN,
  hs_analytics_last_touch_converting_campaign: ExternalOptionTypes.CAMPAIGN,
  hs_persona: ExternalOptionTypes.PERSONA,
  hubspot_owner_id: ExternalOptionTypes.OWNER,
  hubspot_team_id: ExternalOptionTypes.TEAM,
  hs_all_accessible_team_ids: ExternalOptionTypes.TEAM,
  hs_all_assigned_business_unit_ids: ExternalOptionTypes.BUSINESS_UNIT,
  salesforcecampaignids: ExternalOptionTypes.SALESFORCE_CAMPAIGN,
  hs_support_workflows_april_2021: ExternalOptionTypes.AUTOMATION_PLATFORM_WORKFLOWS
}), _defineProperty(_CALL_TYPE_ID$COMPANY, DEAL, {
  '_inbounddbio.importid_': ExternalOptionTypes.INBOUND_DB_IMPORT,
  'engagement.ownerId': ExternalOptionTypes.OWNER,
  'ilsListMemberships.listId': ExternalOptionTypes.INBOUND_DB_LIST,
  deal_currency_code: ExternalOptionTypes.MULTI_CURRENCY_CURRENCY_CODE,
  dealstage: ExternalOptionTypes.DEAL_STAGE,
  hs_persona: ExternalOptionTypes.PERSONA,
  hubspot_owner_id: ExternalOptionTypes.OWNER,
  hubspot_team_id: ExternalOptionTypes.TEAM,
  hs_all_accessible_team_ids: ExternalOptionTypes.TEAM,
  pipeline: ExternalOptionTypes.DEAL_PIPELINE,
  hs_support_workflows_april_2021: ExternalOptionTypes.AUTOMATION_PLATFORM_WORKFLOWS
}), _defineProperty(_CALL_TYPE_ID$COMPANY, ENGAGEMENT, {
  hs_activity_type: ExternalOptionTypes.ACTIVITY_TYPE,
  hs_at_mentioned_owner_ids: ExternalOptionTypes.OWNER,
  hs_created_by: ExternalOptionTypes.USER,
  hs_call_disposition: ExternalOptionTypes.CALL_DISPOSITION,
  hubspot_team_id: ExternalOptionTypes.TEAM,
  hs_all_accessible_team_ids: ExternalOptionTypes.TEAM,
  hubspot_owner_id: ExternalOptionTypes.OWNER
}), _defineProperty(_CALL_TYPE_ID$COMPANY, LINE_ITEM, {
  hs_line_item_currency_code: ExternalOptionTypes.MULTI_CURRENCY_CURRENCY_CODE
}), _defineProperty(_CALL_TYPE_ID$COMPANY, QUOTE, {
  hubspot_team_id: ExternalOptionTypes.TEAM,
  hs_all_accessible_team_ids: ExternalOptionTypes.TEAM,
  hs_support_workflows_april_2021: ExternalOptionTypes.AUTOMATION_PLATFORM_WORKFLOWS
}), _defineProperty(_CALL_TYPE_ID$COMPANY, TICKET, {
  '_inbounddbio.importid_': ExternalOptionTypes.INBOUND_DB_IMPORT,
  'ilsListMemberships.listId': ExternalOptionTypes.INBOUND_DB_LIST,
  hs_pipeline_stage: ExternalOptionTypes.TICKET_STAGE,
  hs_pipeline: ExternalOptionTypes.TICKET_PIPELINE,
  hubspot_owner_id: ExternalOptionTypes.OWNER,
  hubspot_team_id: ExternalOptionTypes.TEAM,
  hs_all_accessible_team_ids: ExternalOptionTypes.TEAM,
  hs_support_workflows_april_2021: ExternalOptionTypes.AUTOMATION_PLATFORM_WORKFLOWS
}), _defineProperty(_CALL_TYPE_ID$COMPANY, VISIT, {
  maxemployees: OptionTypes.MAX_EMPLOYEES,
  maxrevenue: OptionTypes.MAX_REVENUE,
  minemployees: OptionTypes.MIN_EMPLOYEES,
  minrevenue: OptionTypes.MIN_REVENUE
}), _CALL_TYPE_ID$COMPANY);