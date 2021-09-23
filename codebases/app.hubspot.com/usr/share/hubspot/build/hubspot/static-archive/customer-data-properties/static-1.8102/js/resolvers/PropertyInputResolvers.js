'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _RESOLVERS;

import curry from 'transmute/curry';
import { COMPANY, CONTACT, DEAL, TICKET, TASK } from 'customer-data-objects/constants/ObjectTypes';
import { isBusinessUnit, isCallDisposition, isCurrency, isUser } from 'customer-data-objects/property/PropertyIdentifier';
import { DATA_2 } from 'customer-data-objects/record/AnalyticsSourceIdentifier';
import * as ReferenceObjectTypes from 'reference-resolvers/constants/ReferenceObjectTypes';
import BusinessUnitReferenceResolver from 'reference-resolvers/resolvers/BusinessUnitReferenceResolver';
import CallDispositionReferenceResolver from 'reference-resolvers/resolvers/CallDispositionReferenceResolver';
import CampaignReferenceResolver from 'reference-resolvers/resolvers/CampaignReferenceResolver';
import CompanyReferenceResolver from 'reference-resolvers/resolvers/CompanyReferenceResolver';
import ContactReferenceResolver from 'reference-resolvers/resolvers/ContactReferenceResolver';
import ContactByEmailReferenceResolver from 'reference-resolvers/resolvers/ContactByEmailReferenceResolver';
import EmailCampaignReferenceResolver from 'reference-resolvers/resolvers/EmailCampaignReferenceResolver';
import ImportNameReferenceResolver from 'reference-resolvers/resolvers/ImportNameReferenceResolver';
import IntegrationNameReferenceResolver from 'reference-resolvers/resolvers/IntegrationNameReferenceResolver';
import MultiCurrencyCurrencyCodeResolver from 'reference-resolvers/resolvers/MultiCurrencyCurrencyCodeResolver';
import OwnerPagedReferenceResolver from 'reference-resolvers/resolvers/OwnerPagedReferenceResolver';
import PersonaReferenceResolver from 'reference-resolvers/resolvers/PersonaReferenceResolver';
import DealPipelinesReferenceResolver from 'reference-resolvers/resolvers/DealPipelinesReferenceResolver';
import PipelineStageReferenceResolver from 'reference-resolvers/resolvers/PipelineStageReferenceResolver';
import SalesforceCampaignReferenceResolver from 'reference-resolvers/resolvers/SalesforceCampaignReferenceResolver';
import TeamReferenceResolver from 'reference-resolvers/resolvers/TeamReferenceResolver';
import TicketPipelinesReferenceResolver from 'reference-resolvers/resolvers/TicketPipelinesReferenceResolver';
import TicketStagesReferenceResolver from 'reference-resolvers/resolvers/TicketStagesReferenceResolver';
import TaskQueuesReferenceResolver from 'reference-resolvers/resolvers/TaskQueuesReferenceResolver';
import UserReferenceResolver from 'reference-resolvers/resolvers/UserReferenceResolver';
import PropertyNameToReferenceType from 'customer-data-objects/property/PropertyNameToReferenceType';
import EmailValidationResolver from 'reference-resolvers/resolvers/EmailValidationResolver';
import MarketingReasonReferenceResolver from 'reference-resolvers/resolvers/MarketingReasonReferenceResolver';
import DealPipelinesWithPermissionsResolver from 'reference-resolvers/resolvers/DealPipelinesWithPermissionsResolver';
import DealPipelineStagesWithPermissionsResolver from 'reference-resolvers/resolvers/DealPipelineStagesWithPermissionsResolver';
import TicketPipelinesWithPermissionsResolver from 'reference-resolvers/resolvers/TicketPipelinesWithPermissionsResolver';
import TicketPipelineStagesWithPermissionsResolver from 'reference-resolvers/resolvers/TicketPipelineStagesWithPermissionsResolver';
var RESOLVERS = (_RESOLVERS = {}, _defineProperty(_RESOLVERS, ReferenceObjectTypes.BUSINESS_UNIT, BusinessUnitReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.CALL_DISPOSITION, CallDispositionReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.CAMPAIGN, CampaignReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.COMPANY, CompanyReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.CONTACT, ContactReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.CONTACT_BY_EMAIL, ContactByEmailReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.DEAL_PIPELINE_STAGE, PipelineStageReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.DEAL_PIPELINE, DealPipelinesReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.EMAIL_CAMPAIGN, EmailCampaignReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.EMAIL_VALIDATION, EmailValidationResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.IMPORT_NAME, ImportNameReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.INTEGRATION_NAME, IntegrationNameReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.MULTI_CURRENCY_CURRENCY_CODE, MultiCurrencyCurrencyCodeResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.OWNER, OwnerPagedReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.PERSONA, PersonaReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.MARKETING_REASON, MarketingReasonReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.SALESFORCE_CAMPAIGN, SalesforceCampaignReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.TEAM, TeamReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.TICKET_PIPELINE, TicketPipelinesReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.TICKET_STAGE, TicketStagesReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.TASK_QUEUE, TaskQueuesReferenceResolver), _defineProperty(_RESOLVERS, ReferenceObjectTypes.USER, UserReferenceResolver), _RESOLVERS);

var getReferenceObjectType = function getReferenceObjectType(property, objectType) {
  return property.referencedObjectType || PropertyNameToReferenceType[objectType] && PropertyNameToReferenceType[objectType][property.name] || null;
};

var isAssociatedCompany = function isAssociatedCompany(property, objectType) {
  return objectType === CONTACT && property.name === 'associatedcompanyid';
};

var isContactEmail = function isContactEmail(property, objectType) {
  return objectType === CONTACT && property.name === 'email';
};

var isDomain = function isDomain(property, objectType) {
  return objectType === COMPANY && property.name === 'domain';
};

var isHubSpotCampaign = function isHubSpotCampaign(property) {
  return property.name === 'hs_analytics_first_touch_converting_campaign' || property.name === 'hs_analytics_last_touch_converting_campaign';
};

var isParentCompany = function isParentCompany(property) {
  return property.name === 'hs_parent_company_id';
};

var isDealPipeline = function isDealPipeline(property, objectType) {
  return objectType === DEAL && property.name === 'pipeline';
};

var isDealStage = function isDealStage(property, objectType) {
  return objectType === DEAL && property.name === 'dealstage';
};

var isUserId = function isUserId(property, isFromUser) {
  return isFromUser && property.name === DATA_2;
};

var isEmailCampaignId = function isEmailCampaignId(property, isFromEmailMarketing) {
  return isFromEmailMarketing && property.name === DATA_2;
};

var isImportId = function isImportId(property, isFromImport) {
  return isFromImport && property.name === DATA_2;
};

var isIntegrationAppId = function isIntegrationAppId(property, isFromIntegration) {
  return isFromIntegration && property.name === DATA_2;
};

var isOwner = function isOwner(property, objectType) {
  return getReferenceObjectType(property, objectType) === ReferenceObjectTypes.OWNER;
};

var isPersona = function isPersona(property, objectType) {
  return objectType === CONTACT && property.name === 'hs_persona';
};

var isSalesForceCampaign = function isSalesForceCampaign(property, objectType) {
  return objectType === CONTACT && property.name === 'salesforcecampaignids';
};

var isTeam = function isTeam(property) {
  return property.name === 'hubspot_team_id';
};

var isTicketPipeline = function isTicketPipeline(property, objectType) {
  return objectType === TICKET && property.name === 'hs_pipeline';
};

var isTicketStage = function isTicketStage(property, objectType) {
  return objectType === TICKET && property.name === 'hs_pipeline_stage';
};

var isTaskQueue = function isTaskQueue(property, objectType) {
  return objectType === TASK && property.name === 'hs_queue_membership_ids';
};

export var getPropertyInputResolverCreators = function getPropertyInputResolverCreators() {
  var _Object$assign;

  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$includePipelineP = _ref.includePipelinePermissions,
      includePipelinePermissions = _ref$includePipelineP === void 0 ? false : _ref$includePipelineP;

  return includePipelinePermissions ? Object.assign({}, RESOLVERS, (_Object$assign = {}, _defineProperty(_Object$assign, ReferenceObjectTypes.DEAL_PIPELINE, DealPipelinesWithPermissionsResolver), _defineProperty(_Object$assign, ReferenceObjectTypes.DEAL_PIPELINE_STAGE, DealPipelineStagesWithPermissionsResolver), _defineProperty(_Object$assign, ReferenceObjectTypes.TICKET_PIPELINE, TicketPipelinesWithPermissionsResolver), _defineProperty(_Object$assign, ReferenceObjectTypes.TICKET_STAGE, TicketPipelineStagesWithPermissionsResolver), _Object$assign)) : RESOLVERS;
};
export var mapDefaultResolverToPropertyInput = curry(function (resolverType, resolvers, props) {
  return props.resolver ? {
    resolver: props.resolver
  } : resolvers ? {
    resolver: resolvers[resolverType]
  } : {};
});
export var getPropertyInputResolverType = function getPropertyInputResolverType(property, objectType) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      isFromEmailMarketing = _ref2.isFromEmailMarketing,
      isFromImport = _ref2.isFromImport,
      isFromIntegration = _ref2.isFromIntegration,
      isFromUser = _ref2.isFromUser;

  if (isContactEmail(property, objectType)) {
    return ReferenceObjectTypes.CONTACT_BY_EMAIL;
  } else if (isCurrency(property)) {
    return ReferenceObjectTypes.MULTI_CURRENCY_INFORMATION;
  } else if (isDealPipeline(property, objectType) || isDealStage(property, objectType)) {
    return ReferenceObjectTypes.DEAL_PIPELINE;
  } else if (isAssociatedCompany(property, objectType) || isDomain(property, objectType) || isParentCompany(property)) {
    return ReferenceObjectTypes.COMPANY;
  } else if (isHubSpotCampaign(property)) {
    return ReferenceObjectTypes.CAMPAIGN;
  } else if (isCallDisposition(property, objectType)) {
    return ReferenceObjectTypes.CALL_DISPOSITION;
  } else if (isEmailCampaignId(property, isFromEmailMarketing)) {
    return ReferenceObjectTypes.EMAIL_CAMPAIGN;
  } else if (isUserId(property, isFromUser)) {
    return ReferenceObjectTypes.USER;
  } else if (isImportId(property, isFromImport)) {
    return ReferenceObjectTypes.IMPORT_NAME;
  } else if (isIntegrationAppId(property, isFromIntegration)) {
    return ReferenceObjectTypes.INTEGRATION_NAME;
  } else if (isOwner(property, objectType)) {
    return ReferenceObjectTypes.OWNER;
  } else if (isUser(property, objectType)) {
    return ReferenceObjectTypes.USER;
  } else if (isBusinessUnit(property, objectType)) {
    return ReferenceObjectTypes.BUSINESS_UNIT;
  } else if (isPersona(property, objectType)) {
    return ReferenceObjectTypes.PERSONA;
  } else if (isSalesForceCampaign(property, objectType)) {
    return ReferenceObjectTypes.SALESFORCE_CAMPAIGN;
  } else if (isTeam(property)) {
    return ReferenceObjectTypes.TEAM;
  } else if (isTicketPipeline(property, objectType) || isTicketStage(property, objectType)) {
    return ReferenceObjectTypes.TICKET_PIPELINE;
  } else if (isTaskQueue(property, objectType)) {
    return ReferenceObjectTypes.TASK_QUEUE;
  }

  return null;
};
export var getPropertyInputResolver = function getPropertyInputResolver(referenceResolvers, property, objectType, options) {
  var type = getPropertyInputResolverType(property, objectType, options);
  return referenceResolvers[type] || null;
};