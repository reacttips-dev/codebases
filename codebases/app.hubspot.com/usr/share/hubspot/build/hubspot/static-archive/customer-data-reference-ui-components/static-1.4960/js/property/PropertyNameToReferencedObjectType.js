'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _COMPANY$CONTACT$DEAL;

import { COMPANY, CONTACT, DEAL, ENGAGEMENT, LINE_ITEM, QUOTE, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { ACTIVITY_TYPE, CALL_DISPOSITION, CAMPAIGN, COMPANY as ReferenceObjectTypes_Company, CONTACT_LIST, DEAL_PIPELINE, DEAL_PIPELINE_STAGE, FORM, INBOUND_DB_COMPANY_LIST, INBOUND_DB_CONTACT_IMPORT, INBOUND_DB_CONTACT_LIST, INBOUND_DB_DEAL_IMPORT, INBOUND_DB_DEAL_LIST, INBOUND_DB_TICKET_LIST, MULTI_CURRENCY_CURRENCY_CODE, INBOUND_DB_COMPANY_IMPORT, OWNER, PERSONA, SALESFORCE_CAMPAIGN, TEAM, TICKET_PIPELINE, TICKET_STAGE, USER } from 'reference-resolvers/constants/ReferenceObjectTypes';
export default (_COMPANY$CONTACT$DEAL = {}, _defineProperty(_COMPANY$CONTACT$DEAL, COMPANY, {
  '_inbounddbio.importid_': INBOUND_DB_COMPANY_IMPORT,
  'ilsListMemberships.listId': INBOUND_DB_COMPANY_LIST,
  hs_analytics_first_touch_converting_campaign: CAMPAIGN,
  hs_analytics_last_touch_converting_campaign: CAMPAIGN,
  hs_persona: PERSONA,
  hubspot_owner_id: OWNER,
  hubspot_team_id: TEAM
}), _defineProperty(_COMPANY$CONTACT$DEAL, CONTACT, {
  associatedcompanyid: ReferenceObjectTypes_Company,
  '_inbounddbio.importid_': INBOUND_DB_CONTACT_IMPORT,
  'formSubmissions.formId': FORM,
  'listMemberships.listId': CONTACT_LIST,
  'ilsListMemberships.listId': INBOUND_DB_CONTACT_LIST,
  hs_analytics_first_touch_converting_campaign: CAMPAIGN,
  hs_analytics_last_touch_converting_campaign: CAMPAIGN,
  hs_persona: PERSONA,
  hubspot_owner_id: OWNER,
  hubspot_team_id: TEAM,
  salesforcecampaignids: SALESFORCE_CAMPAIGN
}), _defineProperty(_COMPANY$CONTACT$DEAL, DEAL, {
  '_inbounddbio.importid_': INBOUND_DB_DEAL_IMPORT,
  'engagement.ownerId': OWNER,
  'ilsListMemberships.listId': INBOUND_DB_DEAL_LIST,
  deal_currency_code: MULTI_CURRENCY_CURRENCY_CODE,
  dealstage: DEAL_PIPELINE_STAGE,
  hs_persona: PERSONA,
  hubspot_owner_id: OWNER,
  hubspot_team_id: TEAM,
  pipeline: DEAL_PIPELINE
}), _defineProperty(_COMPANY$CONTACT$DEAL, ENGAGEMENT, {
  hs_activity_type: ACTIVITY_TYPE,
  hs_at_mentioned_owner_ids: OWNER,
  hs_created_by: USER,
  hs_call_disposition: CALL_DISPOSITION,
  hubspot_team_id: TEAM
}), _defineProperty(_COMPANY$CONTACT$DEAL, LINE_ITEM, {
  hs_line_item_currency_code: MULTI_CURRENCY_CURRENCY_CODE
}), _defineProperty(_COMPANY$CONTACT$DEAL, QUOTE, {
  hubspot_team_id: TEAM
}), _defineProperty(_COMPANY$CONTACT$DEAL, TICKET, {
  'ilsListMemberships.listId': INBOUND_DB_TICKET_LIST,
  hs_pipeline_stage: TICKET_STAGE,
  hs_pipeline: TICKET_PIPELINE,
  hubspot_owner_id: OWNER,
  hubspot_team_id: TEAM
}), _COMPANY$CONTACT$DEAL);