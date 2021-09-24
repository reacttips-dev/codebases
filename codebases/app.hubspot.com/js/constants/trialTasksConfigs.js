'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _MARKETING_PRO, _UpgradeProductToFeat, _OPERATIONS_PROFESSIO;

import PortalIdParser from 'PortalIdParser';
import { MARKETING_PRO, OPERATIONS_PROFESSIONAL, SALES_PROFESSIONAL } from 'self-service-api/constants/UpgradeProducts';
var portalId = PortalIdParser.get();
export var FeatureKeys = {
  SOCIAL: 'social',
  SEO: 'seo',
  WORKFLOWS: 'workflows',
  CAMPAIGNS: 'campaigns',
  SEQUENCES: 'sequences',
  PRODUCTS: 'products',
  QUOTES: 'quotes',
  FORECASTS: 'forecasts',
  CUSTOM_CODED_WORKFLOW_ACTIONS: 'customCodedWorkflowActions',
  CUSTOM_CODED_BOT_ACTIONS: 'customCodedBotActions',
  WEBHOOKS: 'webhooks',
  DATA_QUALITY_AUTOMATION: 'dataQualityAutomation'
};
export var FeatureKeyToObjectiveKey = _defineProperty({}, MARKETING_PRO, (_MARKETING_PRO = {}, _defineProperty(_MARKETING_PRO, FeatureKeys.WORKFLOWS, 'WORKFLOWS'), _defineProperty(_MARKETING_PRO, FeatureKeys.CAMPAIGNS, 'CAMPAIGNS'), _MARKETING_PRO));
export var UpgradeProductToFeatureKeys = (_UpgradeProductToFeat = {}, _defineProperty(_UpgradeProductToFeat, MARKETING_PRO, [FeatureKeys.SOCIAL, FeatureKeys.SEO, FeatureKeys.WORKFLOWS, FeatureKeys.CAMPAIGNS]), _defineProperty(_UpgradeProductToFeat, SALES_PROFESSIONAL, [FeatureKeys.WORKFLOWS, FeatureKeys.SEQUENCES, FeatureKeys.PRODUCTS, FeatureKeys.QUOTES, FeatureKeys.FORECASTS]), _defineProperty(_UpgradeProductToFeat, OPERATIONS_PROFESSIONAL, [FeatureKeys.CUSTOM_CODED_WORKFLOW_ACTIONS, FeatureKeys.WEBHOOKS, FeatureKeys.CUSTOM_CODED_BOT_ACTIONS, FeatureKeys.DATA_QUALITY_AUTOMATION]), _UpgradeProductToFeat);
export var TaskKeys = {
  topicClusters: 'topicClusters',
  chooseCoreSEOtopic: 'chooseCoreSEOtopic',
  connectSocial: 'connectSocial',
  draftPost: 'draftPost',
  workflowsDemo: 'workflowsDemo',
  workflowsGuide: 'workflowsGuide',
  createWorkflow: 'createWorkflow',
  campaignGuide: 'campaignGuide',
  connectAssets: 'connectAssets',
  createCampaign: 'createCampaign',
  seoDemoMode: 'seoDemoMode',
  socialDemoMode: 'socialDemoMode',
  learnCreateTeams: 'learnCreateTeams',
  teamsGuide: 'teamsGuide',
  createTeam: 'createTeam',
  learnWorkflows: 'learnWorkflows',
  sequencesGuide: 'sequencesGuide',
  learnEnrollContacts: 'learnEnrollContacts',
  createSequence: 'createSequence',
  learnCreateProducts: 'learnCreateProducts',
  createProduct: 'createProduct',
  createQuotesGuide: 'createQuotesGuide',
  learnUseESign: 'learnUseESign',
  createQuote: 'createQuote',
  learnSetupForecasts: 'learnSetupForecasts',
  forecastsGuide: 'forecastsGuide',
  launchForecasts: 'launchForecasts'
};
export var ProgressiveGuideFeatureConfigs = _defineProperty({}, OPERATIONS_PROFESSIONAL, (_OPERATIONS_PROFESSIO = {}, _defineProperty(_OPERATIONS_PROFESSIO, FeatureKeys.CUSTOM_CODED_WORKFLOW_ACTIONS, {
  titleKey: 'trial-banner-ui.contextualFlydown.customCodedWorkflowActions.title',
  bodyKey: 'trial-banner-ui.contextualFlydown.customCodedWorkflowActions.body',
  illustrationName: 'workflows',
  guideUrl: 'https://developers.hubspot.com/docs/api/conversations/code-snippets-in-bots-0?hs_preview=JjseAhdV-35877614093',
  featureUrl: "/workflows/" + portalId
}), _defineProperty(_OPERATIONS_PROFESSIO, FeatureKeys.WEBHOOKS, {
  titleKey: 'trial-banner-ui.contextualFlydown.webhooks.title',
  bodyKey: 'trial-banner-ui.contextualFlydown.webhooks.body',
  illustrationName: 'api',
  guideUrl: 'https://knowledge.hubspot.com/workflows/how-do-i-use-webhooks-with-hubspot-workflows',
  featureUrl: "/workflows/" + portalId
}), _defineProperty(_OPERATIONS_PROFESSIO, FeatureKeys.CUSTOM_CODED_BOT_ACTIONS, {
  titleKey: 'trial-banner-ui.contextualFlydown.customCodedBotActions.title',
  bodyKey: 'trial-banner-ui.contextualFlydown.customCodedBotActions.body',
  illustrationName: 'robot',
  guideUrl: 'https://developers.hubspot.com/docs/api/conversations/code-snippets-in-bots',
  featureUrl: "/chatflows/" + portalId
}), _defineProperty(_OPERATIONS_PROFESSIO, FeatureKeys.DATA_QUALITY_AUTOMATION, {
  titleKey: 'trial-banner-ui.contextualFlydown.dataQualityAutomation.title',
  bodyKey: 'trial-banner-ui.contextualFlydown.dataQualityAutomation.body',
  illustrationName: 'multiple-objects',
  guideUrl: 'https://knowledge.hubspot.com/workflows/format-your-data-with-workflows',
  featureUrl: "/workflows/" + portalId
}), _OPERATIONS_PROFESSIO));