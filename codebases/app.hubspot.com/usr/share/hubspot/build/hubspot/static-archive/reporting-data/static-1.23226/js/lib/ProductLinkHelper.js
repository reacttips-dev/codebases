'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { Map as ImmutableMap } from 'immutable';
import PortalIdParser from 'PortalIdParser';
import { COMPANY, CONTACT, CONVERSATION_INBOX, CTA, DEAL, ENGAGEMENT, FORM, LINE_ITEM, TASK, TICKET, WORKFLOW } from 'reference-resolvers/constants/ReferenceObjectTypes';
import * as DataTypes from '../constants/dataTypes';
import { CONVERSATIONS } from '../constants/dataTypes';

function getDealUrl(dealId) {
  return "/contacts/" + PortalIdParser.get() + "/deal/" + dealId + "/";
}

function getCompanyUrl(companyId) {
  return "/contacts/" + PortalIdParser.get() + "/company/" + companyId + "/";
}

function getContactUrl(contactId) {
  return "/contacts/" + PortalIdParser.get() + "/contact/" + contactId + "/";
}

function getWorkflowUrl(workflowId) {
  return "/contacts/" + PortalIdParser.get() + "/automation/flow/" + workflowId + "/edit/";
}

function getTaskUrl(taskId) {
  return "/contacts/" + PortalIdParser.get() + "/tasks/list/view/all/?taskId=" + taskId;
}

function getTicketUrl(ticketId) {
  return "/contacts/" + PortalIdParser.get() + "/ticket/" + ticketId + "/";
}

function getBroadcastDetailsUrl(broadcastGuid) {
  return "/social/" + PortalIdParser.get() + "/publishing/view/" + broadcastGuid + "?source=report-drilldown";
}

function getCampaignUrl(campaignId) {
  return "/campaigns/" + PortalIdParser.get() + "/" + campaignId;
}

function getConversationsLink(id) {
  return "/live-messages/" + PortalIdParser.get() + "?cvObjectId=" + id;
}

function getConversationsThreadLink(id) {
  return "/live-messages/" + PortalIdParser.get() + "/inbox/" + id;
}

function getCtaUrl(ctaGuid) {
  return "/ctas/" + PortalIdParser.get() + "/details/" + ctaGuid + "/";
}

function getFormUrl(formGuid) {
  return "/forms/" + PortalIdParser.get() + "/" + formGuid + "/performance";
}

var URL_LOOKUP = new ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, COMPANY, getCompanyUrl), _defineProperty(_ImmutableMap, CONTACT, getContactUrl), _defineProperty(_ImmutableMap, CONVERSATIONS, getConversationsLink), _defineProperty(_ImmutableMap, CONVERSATION_INBOX, getConversationsThreadLink), _defineProperty(_ImmutableMap, CTA, getCtaUrl), _defineProperty(_ImmutableMap, DEAL, getDealUrl), _defineProperty(_ImmutableMap, FORM, getFormUrl), _defineProperty(_ImmutableMap, TASK, getTaskUrl), _defineProperty(_ImmutableMap, WORKFLOW, getWorkflowUrl), _defineProperty(_ImmutableMap, TICKET, getTicketUrl), _defineProperty(_ImmutableMap, DataTypes.ATTRIBUTION_TOUCH_POINTS, getCampaignUrl), _defineProperty(_ImmutableMap, DataTypes.CONTACT_CREATE_ATTRIBUTION, getCampaignUrl), _defineProperty(_ImmutableMap, DataTypes.SOCIAL_POSTS, getBroadcastDetailsUrl), _ImmutableMap));
export var getReferenceType = function getReferenceType(dataType) {
  var _DataTypes$CONTACTS$D;

  return (_DataTypes$CONTACTS$D = {}, _defineProperty(_DataTypes$CONTACTS$D, DataTypes.CONTACTS, CONTACT), _defineProperty(_DataTypes$CONTACTS$D, DataTypes.COMPANIES, COMPANY), _defineProperty(_DataTypes$CONTACTS$D, DataTypes.DEALS, DEAL), _defineProperty(_DataTypes$CONTACTS$D, DataTypes.ENGAGEMENT, ENGAGEMENT), _defineProperty(_DataTypes$CONTACTS$D, DataTypes.ENGAGEMENTS, ENGAGEMENT), _defineProperty(_DataTypes$CONTACTS$D, DataTypes.TICKETS, TICKET), _defineProperty(_DataTypes$CONTACTS$D, DataTypes.LINE_ITEMS, LINE_ITEM), _defineProperty(_DataTypes$CONTACTS$D, DataTypes.SOCIAL_POSTS, DataTypes.SOCIAL_POSTS), _DataTypes$CONTACTS$D)[dataType];
};
export var getProductLink = function getProductLink(referenceType, id) {
  var productLink = URL_LOOKUP.get(referenceType);
  return productLink && id && id !== 'null' ? productLink(id) : null;
};
export var getProductLinkFromDataType = function getProductLinkFromDataType(dataType, id) {
  return getProductLink(getReferenceType(dataType), id);
};