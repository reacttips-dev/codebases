'use es6';

import enviro from 'enviro';
import { Map as ImmutableMap } from 'immutable';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import { betHasCustomDealForm } from 'customer-data-objects/permissions/BETPermissions';
import { ADDITIONAL_SERVICES_CLOSED_LOST_QA, ADDITIONAL_SERVICES_CLOSED_LOST_PROD, ADDITIONAL_URL_CLOSED_LOST_QA, ADDITIONAL_URL_CLOSED_LOST_PROD, AT_RISK_CHURNED_QA, AT_RISK_CHURNED_PROD, CONTRACT_CHANGE_CLOSED_LOST_QA, CONTRACT_CHANGE_CLOSED_LOST_PROD, CONTRACT_NOTIFICATION_CLOSED_LOST_QA, CONTRACT_NOTIFICATION_CLOSED_LOST_PROD, DOUBLE_COMP_CLOSED_LOST_QA, DOUBLE_COMP_CLOSED_LOST_PROD, MRR_DOWNGRADE_CLOSED_LOST_QA, MRR_DOWNGRADE_CLOSED_LOST_PROD, MRR_UPGRADE_CLOSED_LOST_QA, MRR_UPGRADE_CLOSED_LOST_PROD, PARTNER_SALES_PROCESS_CLOSED_LOST_QA, PARTNER_SALES_PROCESS_CLOSED_LOST_PROD, PIPELINE_1_PRO_CLOSED_LOST_QA, PIPELINE_1_PRO_CLOSED_LOST_PROD, PIPELINE_1_PRO_CLOSED_WON_QA, PIPELINE_1_PRO_CLOSED_WON_PROD, PIPELINE_2_STARTER_CLOSED_LOST_QA, PIPELINE_2_STARTER_CLOSED_LOST_PROD, PROMOTION_CLOSED_LOST_QA, PROMOTION_CLOSED_LOST_PROD, RENEWAL_CLOSED_LOST_QA, RENEWAL_CLOSED_LOST_PROD, SALES_PROCESS_CLOSED_LOST_QA, SALES_PROCESS_CLOSED_LOST_PROD } from 'BizOpsCrmUIComponents/constants/DealStages';
var AT_RISK_PIPELINE_ID_QA = 'cbac3ccd-5ed2-4403-aad3-f89705937989';
var AT_RISK_PIPELINE_ID_PROD = '49a8ba0f-0fcb-4ecd-85bc-05ad4a55ea1f';
var ADDITIONAL_SERVICES_PIPELINE_ID_QA = '9b4c4174-b45f-4039-99e5-0407ba9fab50';
var ADDITIONAL_SERVICES_PIPELINE_ID_PROD = 'bea4be68-40d0-42c9-9867-62a204008311';
var ADDITIONAL_URL_PIPELINE_ID_QA = '489d75c9-6d9c-4c21-9337-78479e9eab8a';
var ADDITIONAL_URL_PIPELINE_ID_PROD = '39ae23a8-8a0a-44cb-8d26-7bd79bc9437d';
var CONTRACT_CHANGE_PIPELINE_ID_QA = '37f54e6a-2dcc-4800-919a-4af81cd013da';
var CONTRACT_CHANGE_PIPELINE_ID_PROD = 'dc15cb0e-592c-4007-803f-a79c1449bd62';
var CONTRACT_NOTIFICATION_PIPELINE_ID_QA = 'bec8a5a8-e960-47a6-a823-383d0fcb6628';
var CONTRACT_NOTIFICATION_PIPELINE_ID_PROD = 'c90cfee0-df03-4abe-a647-8dc4d0aa1afb';
var DOUBLE_COMP_PIPELINE_ID_QA = '01478afe-76e3-456e-a016-290ebd4d0bf7';
var DOUBLE_COMP_PIPELINE_ID_PROD = 'a126ca5c-e784-4b2d-8aa3-c8910578b05a';
var ECOMMERCE_PIPELINE_ID_QA = '9363274';
var ECOMMERCE_PIPELINE_ID_PROD = '15912478';
var HUBSPOT_AP_SALES_PROCESS_PIPELINE_ID_QA = '6d977473-4849-465d-9f9d-c0a0f475b254';
var HUBSPOT_AP_SALES_PROCESS_PIPELINE_ID_PROD = '28e06048-33d3-4b1e-8919-5627faea0385';
var HUBSPOT_SALES_PROCESS_PIPELINE_ID_QA = 'default';
var HUBSPOT_SALES_PROCESS_PIPELINE_ID_PROD = 'default';
var MRR_UPGRADE_PIPELINE_ID_QA = '9a8ef7b3-3525-42e1-b595-86d51512a25f';
var MRR_UPGRADE_PIPELINE_ID_PROD = '85e453ef-e47b-430e-80d4-bf9df054a8b7';
var MRR_DOWNGRADE_PIPELINE_ID_QA = 'b0fcedf4-0fde-4771-9c1a-92236f6a5c99';
var MRR_DOWNGRADE_PIPELINE_ID_PROD = 'eda9c4f2-63c7-4170-80b0-6f6364fa8cc4';
var PIPELINE_1_PRO_QA = '1996993';
var PIPELINE_1_PRO_PROD = '5211224';
var PIPELINE_2_STARTER_QA = '1996175';
var PIPELINE_2_STARTER_PROD = '5211240';
var PROMOTION_PIPELINE_ID_QA = '7c8c0fe3-1bc8-4f90-a718-363a07d76201';
var PROMOTION_PIPELINE_ID_PROD = 'a7503d91-a182-4862-81fc-361a70348394';
var RENEWAL_PIPELINE_ID_QA = '37f54e6a-2dcc-4800-919a-4af81cd013da';
var RENEWAL_PIPELINE_ID_PROD = 'dc15cb0e-592c-4007-803f-a79c1449bd62';
var CLOSED_LOST_STAGE_ID_BY_PIPELINE_ID_MAP_QA = new ImmutableMap([[AT_RISK_PIPELINE_ID_QA, AT_RISK_CHURNED_QA], [ADDITIONAL_SERVICES_PIPELINE_ID_QA, ADDITIONAL_SERVICES_CLOSED_LOST_QA], [ADDITIONAL_URL_PIPELINE_ID_QA, ADDITIONAL_URL_CLOSED_LOST_QA], [CONTRACT_CHANGE_PIPELINE_ID_QA, CONTRACT_CHANGE_CLOSED_LOST_QA], [CONTRACT_NOTIFICATION_PIPELINE_ID_QA, CONTRACT_NOTIFICATION_CLOSED_LOST_QA], [DOUBLE_COMP_PIPELINE_ID_QA, DOUBLE_COMP_CLOSED_LOST_QA], [HUBSPOT_AP_SALES_PROCESS_PIPELINE_ID_QA, PARTNER_SALES_PROCESS_CLOSED_LOST_QA], [HUBSPOT_SALES_PROCESS_PIPELINE_ID_QA, SALES_PROCESS_CLOSED_LOST_QA], [MRR_UPGRADE_PIPELINE_ID_QA, MRR_UPGRADE_CLOSED_LOST_QA], [MRR_DOWNGRADE_PIPELINE_ID_QA, MRR_DOWNGRADE_CLOSED_LOST_QA], [PIPELINE_1_PRO_QA, PIPELINE_1_PRO_CLOSED_LOST_QA], [PIPELINE_2_STARTER_QA, PIPELINE_2_STARTER_CLOSED_LOST_QA], [PROMOTION_PIPELINE_ID_QA, PROMOTION_CLOSED_LOST_QA], [RENEWAL_PIPELINE_ID_QA, RENEWAL_CLOSED_LOST_QA]]);
var CLOSED_LOST_STAGE_ID_BY_PIPELINE_ID_MAP_PROD = new ImmutableMap([[AT_RISK_PIPELINE_ID_PROD, AT_RISK_CHURNED_PROD], [ADDITIONAL_SERVICES_PIPELINE_ID_PROD, ADDITIONAL_SERVICES_CLOSED_LOST_PROD], [ADDITIONAL_URL_PIPELINE_ID_PROD, ADDITIONAL_URL_CLOSED_LOST_PROD], [CONTRACT_CHANGE_PIPELINE_ID_PROD, CONTRACT_CHANGE_CLOSED_LOST_PROD], [CONTRACT_NOTIFICATION_PIPELINE_ID_PROD, CONTRACT_NOTIFICATION_CLOSED_LOST_PROD], [DOUBLE_COMP_PIPELINE_ID_PROD, DOUBLE_COMP_CLOSED_LOST_PROD], [HUBSPOT_AP_SALES_PROCESS_PIPELINE_ID_PROD, PARTNER_SALES_PROCESS_CLOSED_LOST_PROD], [HUBSPOT_SALES_PROCESS_PIPELINE_ID_PROD, SALES_PROCESS_CLOSED_LOST_PROD], [MRR_UPGRADE_PIPELINE_ID_PROD, MRR_UPGRADE_CLOSED_LOST_PROD], [MRR_DOWNGRADE_PIPELINE_ID_PROD, MRR_DOWNGRADE_CLOSED_LOST_PROD], [PIPELINE_1_PRO_PROD, PIPELINE_1_PRO_CLOSED_LOST_PROD], [PIPELINE_2_STARTER_PROD, PIPELINE_2_STARTER_CLOSED_LOST_PROD], [PROMOTION_PIPELINE_ID_PROD, PROMOTION_CLOSED_LOST_PROD], [RENEWAL_PIPELINE_ID_PROD, RENEWAL_CLOSED_LOST_PROD]]);

function getSandlerStarterPipelineId() {
  return enviro.isQa() ? PIPELINE_2_STARTER_QA : PIPELINE_2_STARTER_PROD;
}

function getAdditionalUrlPipelineId() {
  return enviro.isQa() ? ADDITIONAL_URL_PIPELINE_ID_QA : ADDITIONAL_URL_PIPELINE_ID_PROD;
}

function getHubspotSalesProcessPipelineId() {
  return enviro.isQa() ? HUBSPOT_SALES_PROCESS_PIPELINE_ID_QA : HUBSPOT_SALES_PROCESS_PIPELINE_ID_PROD;
}

function getMrrUpgradePipelineId() {
  return enviro.isQa() ? MRR_UPGRADE_PIPELINE_ID_QA : MRR_UPGRADE_PIPELINE_ID_PROD;
}

function getHubspotAPSalesProcessPipelineId() {
  return enviro.isQa() ? HUBSPOT_AP_SALES_PROCESS_PIPELINE_ID_QA : HUBSPOT_AP_SALES_PROCESS_PIPELINE_ID_PROD;
}

function getPromotionDealPipelineId() {
  return enviro.isQa() ? PROMOTION_PIPELINE_ID_QA : PROMOTION_PIPELINE_ID_PROD;
}

function getContractChangePipelineId() {
  return enviro.isQa() ? CONTRACT_CHANGE_PIPELINE_ID_QA : CONTRACT_CHANGE_PIPELINE_ID_PROD;
}

function getRenewalPipelineId() {
  return enviro.isQa() ? RENEWAL_PIPELINE_ID_QA : RENEWAL_PIPELINE_ID_PROD;
}

function getPipelineId(deal) {
  return getProperty(deal, 'pipeline');
}

export function getClosedLostStageIdForPipelineId(pipelineId) {
  return enviro.isQa() ? CLOSED_LOST_STAGE_ID_BY_PIPELINE_ID_MAP_QA.get(pipelineId) : CLOSED_LOST_STAGE_ID_BY_PIPELINE_ID_MAP_PROD.get(pipelineId);
}
export function getSandlerProPlusPipelineId() {
  return enviro.isQa() ? PIPELINE_1_PRO_QA : PIPELINE_1_PRO_PROD;
}
export function getSandlerProPlusClosedWonStageId() {
  return enviro.isQa() ? PIPELINE_1_PRO_CLOSED_WON_QA : PIPELINE_1_PRO_CLOSED_WON_PROD;
}
export function isAdditionalUrlDealPipeline(deal) {
  return getPipelineId(deal) === getAdditionalUrlPipelineId();
}
export function isRenewalDealPipeline(deal) {
  return getPipelineId(deal) === getRenewalPipelineId();
}
export function isDirectSalesDealPipeline(deal) {
  return getPipelineId(deal) === getHubspotSalesProcessPipelineId();
}
export function isMrrUpgradeDealPipeline(deal) {
  return getPipelineId(deal) === getMrrUpgradePipelineId();
}
export function isPromotionDealPipeline(deal) {
  return getPipelineId(deal) === getPromotionDealPipelineId();
}
export function isContractChangePipeline(deal) {
  return getPipelineId(deal) === getContractChangePipelineId();
}
export function isNewSandlerPipeline(deal) {
  return getPipelineId(deal) === getSandlerProPlusPipelineId() || getPipelineId(deal) === getSandlerStarterPipelineId();
}
export function getEcommercePipelineId() {
  return enviro.isQa() ? ECOMMERCE_PIPELINE_ID_QA : ECOMMERCE_PIPELINE_ID_PROD;
}
export function isEcommercePipeline(deal) {
  return getPipelineId(deal) === getEcommercePipelineId();
}
export function isCustomerSummaryEnabledPipeline(deal) {
  var pipelineId = getPipelineId(deal);
  return pipelineId === getAdditionalUrlPipelineId() || pipelineId === getHubspotAPSalesProcessPipelineId() || pipelineId === getHubspotSalesProcessPipelineId() || pipelineId === getMrrUpgradePipelineId() || pipelineId === getSandlerProPlusPipelineId() || pipelineId === getSandlerStarterPipelineId();
}
export function isDingNotesEnabledPipeline(deal) {
  var pipelineId = getPipelineId(deal);
  return pipelineId === getAdditionalUrlPipelineId() || pipelineId === getHubspotAPSalesProcessPipelineId() || pipelineId === getHubspotSalesProcessPipelineId() || pipelineId === getMrrUpgradePipelineId();
}
export function getPropertiesToFilter(scopes) {
  var deal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableMap();
  var propertyDefaults = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ImmutableMap();
  var getUrlPipelineId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : getAdditionalUrlPipelineId;

  if (!betHasCustomDealForm(scopes)) {
    return [];
  }

  var pipelineId = deal.get('pipeline') || propertyDefaults.get('pipeline');
  return pipelineId === getUrlPipelineId() ? ['authority', 'qualification_for_iga'] : ['website', 'additional_url_website'];
}