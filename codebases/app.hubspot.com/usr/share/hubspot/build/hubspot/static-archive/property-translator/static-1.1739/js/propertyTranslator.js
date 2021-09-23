'use es6';

import I18n from 'I18n';
import getDescriptionHashKey from './internal/getDescriptionHashKey';
import isValidI18nKey from 'I18n/utils/isValidI18nKey';
var re = /[\()\/\.\:\?\,\s\-\–\'&]/gi;
var nameSpaceKey = 'recordProperties';
var descriptionsNameSpaceKey = nameSpaceKey + ".propertyDescriptions";

var silentI18nText = function silentI18nText(key) {
  var temp = I18n.lookup(key);
  var translation = temp && typeof temp !== 'function' && I18n.text(key);
  return translation || undefined;
};

var tryLookup = function tryLookup(key, aString) {
  return silentI18nText(key) || aString;
};

var isInvalidString = function isInvalidString(maybeString) {
  return typeof maybeString !== 'string' || maybeString.length === 0;
};

var convertToKey = function convertToKey(aString) {
  return isInvalidString(aString) ? '' : aString.replace(re, '_').toLowerCase();
};

var makeNameSpacedKey = function makeNameSpacedKey(aString) {
  return nameSpaceKey + "." + convertToKey(aString);
};

var makeDescriptionKey = function makeDescriptionKey(label, description) {
  return descriptionsNameSpaceKey + "." + getDescriptionHashKey(description);
};

var tryYourTranslation = function tryYourTranslation(aString, optionalKeyPrefix) {
  var keyString = convertToKey(aString);

  if (!isInvalidString(optionalKeyPrefix)) {
    keyString = optionalKeyPrefix + "." + keyString;
  }

  return tryLookup(keyString, aString);
};

var propertyLabelTranslator = function propertyLabelTranslator(label) {
  var nameSpaceLookupKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : nameSpaceKey;

  if (label && label === label.toUpperCase()) {
    return label;
  }

  return tryYourTranslation(label, nameSpaceLookupKey);
};

var propertyLabelTranslatorWithIsHubSpotDefined = function propertyLabelTranslatorWithIsHubSpotDefined(_ref) {
  var label = _ref.label,
      nameSpaceLookupKey = _ref.nameSpaceLookupKey,
      isHubSpotDefined = _ref.isHubSpotDefined;

  if (isHubSpotDefined !== undefined && !isHubSpotDefined) {
    return label;
  }

  return propertyLabelTranslator(label, nameSpaceLookupKey || nameSpaceKey);
};

var propertyDescriptionTranslator = function propertyDescriptionTranslator(label, description) {
  if (isInvalidString(description) || typeof I18n.lookup(descriptionsNameSpaceKey) !== 'object') {
    return description;
  }

  var descriptionKey = makeDescriptionKey(label, description);
  return tryLookup(descriptionKey, description);
};

var dealHubspotStages = {
  //deal stages - BE file here: https://git.hubteam.com/HubSpot/Deals/blob/master/DealsBase/src/main/java/com/hubspot/deals/base/DealsPipeline.java
  appointmentscheduled: 'appointment scheduled',
  qualifiedtobuy: 'qualified to buy',
  presentationscheduled: 'presentation scheduled',
  decisionmakerboughtin: 'decision maker bought-in',
  contractsent: 'contract sent',
  closedwon: 'closed won',
  closedlost: 'closed lost'
};
var lifecycleStages = {
  //BE file here - https://git.hubteam.com/HubSpot/ObjectPipelines/blob/master/PipelinesCore/src/main/java/com/hubspot/objectpipelines/models/DefaultLifecycleStage.java#L17
  subscriber: 'subscriber',
  lead: 'lead',
  marketingqualifiedlead: 'marketingqualifiedlead',
  salesqualifiedlead: 'salesqualifiedlead',
  opportunity: 'opportunity',
  customer: 'customer',
  evangelist: 'evangelist',
  other: 'other'
}; //pipeline stages - BE file here: https://git.hubteam.com/HubSpot/ObjectPipelines/blob/master/PipelinesCore/src/main/java/com/hubspot/objectpipelines/DefaultImmutablePipelines.java

var ticketHubspotStages = {
  '1': 'new',
  '2': 'waiting on contact',
  '3': 'waiting on us',
  '4': 'closed'
};

var getDefaultStageLabel = function getDefaultStageLabel(stage) {
  var stageObjectType = stage.objectType;

  switch (stageObjectType) {
    case 'DEAL':
      {
        return dealHubspotStages[stage.stageId];
      }

    case 'TICKET':
      {
        return ticketHubspotStages[stage.stageId];
      }

    case 'COMPANY':
    case 'CONTACT':
      {
        return lifecycleStages[stage.stageId];
      }

    default:
      {
        return null;
      }
  }
};
/**
 * Translates a stage on the default LCS, deal, or ticket pipeline
 * If no valid translation exists, or the label property has been customized, it returns stage.label
 * @param {Object} stage - needs stage.label, stage.stageId, stage.pipelineId, and stage.objectType
 */


var stageLabelTranslator = function stageLabelTranslator(stage) {
  var defaultPipeline = stage.pipelineId === 'default' || stage.pipelineId === '0' || stage.pipelineId === 'contacts-lifecycle-pipeline' || stage.pipelineId === 'companies-lifecycle-pipeline';

  if (!defaultPipeline) {
    return stage.label;
  }

  var defaultStageLabel = getDefaultStageLabel(stage);
  var currentLabelEqualsDefaultLabel = stage.label.toLowerCase() === defaultStageLabel;
  var translationForLabelExists = isValidI18nKey("stageLabels." + stage.stageId);

  if (currentLabelEqualsDefaultLabel && translationForLabelExists) {
    return I18n.text("stageLabels." + stage.stageId);
  }

  return stage.label;
};

export { isInvalidString, convertToKey, makeNameSpacedKey, makeDescriptionKey, tryLookup, tryYourTranslation, propertyDescriptionTranslator, propertyLabelTranslator, propertyLabelTranslatorWithIsHubSpotDefined, stageLabelTranslator };