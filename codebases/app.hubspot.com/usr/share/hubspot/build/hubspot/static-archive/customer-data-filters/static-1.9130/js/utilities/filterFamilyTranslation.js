'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import * as DSAssetFamilies from 'customer-data-filters/filterQueryFormat/DSAssetFamilies/DSAssetFamilies';
import * as ObjectTypes from 'customer-data-objects/constants/ObjectTypes';
import { DSAssetFamilyToObjectType } from 'customer-data-filters/filterQueryFormat/DSAssetFamilies/DSAssetFamilyMappings';
import { ObjectTypeFromIds, ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import { ObjectTypeIdRegex } from 'customer-data-filters/filterQueryFormat/ObjectTypeId';
import { getDynamicFilterFamilyBasis, testDynamicFilterFamily } from '../filterQueryFormat/DynamicFilterFamilies';
import ObjectDefinitionProvider from '../filterQueryFormat/objectDefinition/ObjectDefinitionProvider';
import invariant from 'react-utils/invariant';
var ObjectTypeIdWhitelist = [ObjectTypesToIds.COMPANY, ObjectTypesToIds.CONTACT, ObjectTypesToIds.DEAL, ObjectTypesToIds.ENGAGEMENT, ObjectTypesToIds.LINE_ITEM, ObjectTypesToIds.PRODUCT, ObjectTypesToIds.QUOTE, ObjectTypesToIds.TICKET, ObjectTypesToIds.FEEDBACK_SUBMISSION].concat(_toConsumableArray(ObjectDefinitionProvider.getAll().map(function (objectDefinition) {
  return objectDefinition.get('objectTypeId');
})));
var FilterFamilyNameWhitelist = [// families that are customer-data ObjectTypes
ObjectTypes.COMPANY, ObjectTypes.CONTACT, ObjectTypes.DEAL, ObjectTypes.ENGAGEMENT, ObjectTypes.LINE_ITEM, ObjectTypes.PRODUCT, ObjectTypes.QUOTE, ObjectTypes.TICKET, ObjectTypes.FEEDBACK_SUBMISSION, // families that are only in ListSegClassic, note that property families are
// convertered to object types in dsAssetFamilyToReadableString.
DSAssetFamilies.ADS_PROPERTY, DSAssetFamilies.CTA, DSAssetFamilies.EMAIL_CAMPAIGN, DSAssetFamilies.EMAIL_SUBSCRIPTION, DSAssetFamilies.EVENT, DSAssetFamilies.FORM, DSAssetFamilies.CONTACT_IMPORT, DSAssetFamilies.CONTACT_LIST, DSAssetFamilies.IN_LIST, DSAssetFamilies.IMPORT, DSAssetFamilies.PAGE_VIEW, DSAssetFamilies.SURVEY_MONKEY_SURVEY, DSAssetFamilies.SURVEY_MONKEY_QUESTION, DSAssetFamilies.GOTO_WEBINAR_WEBINAR, DSAssetFamilies.WORKFLOW, DSAssetFamilies.CUSTOM_BEHAVIORAL_EVENT, DSAssetFamilies.CUSTOM_BEHAVIORAL_EVENT_TYPE, DSAssetFamilies.INTEGRATION, // Analytics Settings filterFamily (#analytics-tools)
'VIEW', // Reporting (#reporting-dashboard)
'ENGAGEMENT_LEGACY', DSAssetFamilies.INTEGRATION].concat(_toConsumableArray(ObjectDefinitionProvider.getAll().map(function (objectDefinition) {
  return objectDefinition.get('objectType');
})));
export var legacyObjectTypes = [ObjectTypes.COMPANY, ObjectTypes.CONTACT, ObjectTypes.DEAL, ObjectTypes.TICKET, ObjectTypes.ENGAGEMENT, ObjectTypes.LINE_ITEM, ObjectTypes.PRODUCT, ObjectTypes.QUOTE, ObjectTypes.FEEDBACK_SUBMISSION].concat(_toConsumableArray(ObjectDefinitionProvider.getAll().map(function (objectDefinition) {
  return objectDefinition.get('objectType');
})));

var isCrmObjectFilterFamily = function isCrmObjectFilterFamily(filterFamilyName) {
  return legacyObjectTypes.includes(filterFamilyName) || ObjectTypeIdRegex.test(filterFamilyName);
};

export var getFilterFamilyName = function getFilterFamilyName(filterFamily) {
  if (DSAssetFamilyToObjectType.has(filterFamily)) {
    return DSAssetFamilyToObjectType.get(filterFamily);
  }

  if (ObjectTypeIdWhitelist.includes(filterFamily)) {
    if (ObjectTypeFromIds[filterFamily]) {
      return ObjectTypeFromIds[filterFamily];
    }

    var def = ObjectDefinitionProvider.getById(filterFamily);

    if (def) {
      return def.get('objectType');
    }
  }

  return filterFamily;
};
export var getTranslationOptions = function getTranslationOptions(_ref) {
  var filterFamily = _ref.filterFamily,
      getFilterFamilyEntityName = _ref.getFilterFamilyEntityName;

  if (isCrmObjectFilterFamily(filterFamily) || testDynamicFilterFamily(DSAssetFamilies.INTEGRATION, filterFamily) || testDynamicFilterFamily(DSAssetFamilies.CUSTOM_BEHAVIORAL_EVENT_TYPE, filterFamily)) {
    var entityName = getFilterFamilyEntityName(filterFamily);
    invariant(entityName, "Filter Family Entity Name must be provided and was not found for " + filterFamily);
    return {
      entityName: entityName
    };
  }

  return undefined;
};
export var getDefaultTranslationKey = function getDefaultTranslationKey(filterFamily) {
  var dynamicFilterFamilyBasis = getDynamicFilterFamilyBasis(filterFamily);
  var effectiveFilterFamily = getFilterFamilyName(dynamicFilterFamilyBasis || filterFamily);

  if (isCrmObjectFilterFamily(effectiveFilterFamily)) {
    return 'CRM_OBJECT';
  }

  return FilterFamilyNameWhitelist.find(function (whiteListedFamily) {
    return whiteListedFamily === effectiveFilterFamily;
  });
};