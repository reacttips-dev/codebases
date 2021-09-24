'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Object$freeze;

import * as DSAssetFamilies from 'customer-data-filters/filterQueryFormat/DSAssetFamilies/DSAssetFamilies';
import * as PropertyTypes from 'customer-data-objects/property/PropertyTypes';
import { Map as ImmutableMap } from 'immutable';
import { EnumerationDisplayType, StringDisplayType } from '../../filterQueryFormat/DisplayTypes';
import { makeEventCountField } from '../converters/specialFields/EventCountField';
import { makeEventDateField } from '../converters/specialFields/EventDateField';
import { makeEventStatusField } from '../converters/specialFields/EventStatusField';
import { makeEventSubjectField } from '../converters/specialFields/EventSubjectField';
import I18n from 'I18n';
import AnyFormSubmissionField from '../../converters/listSegClassic/specialFields/AnyFormSubmissionField';
import PageViewField from '../../converters/listSegClassic/specialFields/PageViewField';
import MissingField from '../../filterQueryFormat/MissingField';
import EmailSubscriptionField from '../../converters/listSegClassic/specialFields/EmailSubscriptionField';
import { makeEventSubjectVersionField } from '../converters/specialFields/EventSubjectVersionField';
import { makeEventPageField } from '../converters/specialFields/EventPageField';
var EVENT_BASED_FILTER_FAMILIES = Object.freeze([DSAssetFamilies.PAGE_VIEW, DSAssetFamilies.FORM, DSAssetFamilies.EMAIL_CAMPAIGN, DSAssetFamilies.EMAIL_SUBSCRIPTION, DSAssetFamilies.CTA, DSAssetFamilies.EVENT]);
var REFINABLE_EXTRA_FILTER_FAMILIES = Object.freeze([DSAssetFamilies.PAGE_VIEW, DSAssetFamilies.FORM, DSAssetFamilies.CTA, DSAssetFamilies.EVENT]);
export var EVENT_BASED_FIELD_KEYS = Object.freeze({
  EVENT_SUBJECT: 'hs_event_subject',
  EVENT_SUBJECT_VERSION: 'hs_event_subject_version',
  EVENT_STATUS: 'hs_event_status',
  EVENT_DATE: 'hs_event_date',
  EVENT_COUNT: 'hs_event_count',
  EVENT_PAGE: 'hs_event_page'
});
export var isEventBasedFilterFamily = function isEventBasedFilterFamily(filterFamily) {
  return EVENT_BASED_FILTER_FAMILIES.includes(filterFamily);
};

var getPageViewFields = function getPageViewFields() {
  var _ImmutableMap;

  return ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, EVENT_BASED_FIELD_KEYS.EVENT_STATUS, {
    field: makeEventStatusField(DSAssetFamilies.PAGE_VIEW, StringDisplayType),
    isSelectable: false
  }), _defineProperty(_ImmutableMap, EVENT_BASED_FIELD_KEYS.EVENT_DATE, {
    field: makeEventDateField(DSAssetFamilies.PAGE_VIEW),
    isSelectable: true
  }), _defineProperty(_ImmutableMap, EVENT_BASED_FIELD_KEYS.EVENT_COUNT, {
    field: makeEventCountField(DSAssetFamilies.PAGE_VIEW),
    isSelectable: true
  }), _ImmutableMap));
};

var getFormSubmissionFields = function getFormSubmissionFields(data) {
  var _ImmutableMap2;

  return ImmutableMap((_ImmutableMap2 = {}, _defineProperty(_ImmutableMap2, EVENT_BASED_FIELD_KEYS.EVENT_STATUS, {
    field: makeEventStatusField(DSAssetFamilies.FORM, EnumerationDisplayType),
    isSelectable: false
  }), _defineProperty(_ImmutableMap2, EVENT_BASED_FIELD_KEYS.EVENT_SUBJECT, {
    field: makeEventSubjectField(DSAssetFamilies.FORM, data),
    isSelectable: false
  }), _defineProperty(_ImmutableMap2, EVENT_BASED_FIELD_KEYS.EVENT_PAGE, {
    field: makeEventPageField(DSAssetFamilies.FORM, EnumerationDisplayType),
    isSelectable: true
  }), _defineProperty(_ImmutableMap2, EVENT_BASED_FIELD_KEYS.EVENT_DATE, {
    field: makeEventDateField(DSAssetFamilies.FORM),
    isSelectable: true
  }), _defineProperty(_ImmutableMap2, EVENT_BASED_FIELD_KEYS.EVENT_COUNT, {
    field: makeEventCountField(DSAssetFamilies.FORM),
    isSelectable: true
  }), _ImmutableMap2));
};

var getEmailCampaignFields = function getEmailCampaignFields(data) {
  var _ImmutableMap3;

  return ImmutableMap((_ImmutableMap3 = {}, _defineProperty(_ImmutableMap3, EVENT_BASED_FIELD_KEYS.EVENT_STATUS, {
    field: makeEventStatusField(DSAssetFamilies.EMAIL_CAMPAIGN, EnumerationDisplayType),
    isSelectable: false
  }), _defineProperty(_ImmutableMap3, EVENT_BASED_FIELD_KEYS.EVENT_SUBJECT, {
    field: makeEventSubjectField(DSAssetFamilies.EMAIL_CAMPAIGN, data, I18n.text("newCustomerDataFilters.specialFields.EMAIL_CAMPAIGN." + EVENT_BASED_FIELD_KEYS.EVENT_SUBJECT + "_placeholder")),
    isSelectable: false
  }), _defineProperty(_ImmutableMap3, EVENT_BASED_FIELD_KEYS.EVENT_DATE, {
    field: makeEventDateField(DSAssetFamilies.EMAIL_CAMPAIGN),
    isSelectable: true
  }), _ImmutableMap3));
};

var getEmailSubscriptionFields = function getEmailSubscriptionFields() {
  return ImmutableMap(_defineProperty({}, EVENT_BASED_FIELD_KEYS.EVENT_STATUS, {
    field: makeEventStatusField(DSAssetFamilies.EMAIL_SUBSCRIPTION, EnumerationDisplayType),
    isSelectable: true
  }));
};

var getCTAFields = function getCTAFields(data, condition) {
  var _ImmutableMap5;

  return ImmutableMap((_ImmutableMap5 = {}, _defineProperty(_ImmutableMap5, EVENT_BASED_FIELD_KEYS.EVENT_STATUS, {
    field: makeEventStatusField(DSAssetFamilies.CTA, EnumerationDisplayType),
    isSelectable: false
  }), _defineProperty(_ImmutableMap5, EVENT_BASED_FIELD_KEYS.EVENT_SUBJECT, {
    field: makeEventSubjectField(DSAssetFamilies.CTA, data, I18n.text("newCustomerDataFilters.specialFields.CTA." + EVENT_BASED_FIELD_KEYS.EVENT_SUBJECT + "_placeholder")),
    isSelectable: false
  }), _defineProperty(_ImmutableMap5, EVENT_BASED_FIELD_KEYS.EVENT_SUBJECT_VERSION, {
    field: makeEventSubjectVersionField(DSAssetFamilies.CTA, condition, I18n.text("newCustomerDataFilters.specialFields.CTA." + EVENT_BASED_FIELD_KEYS.EVENT_SUBJECT_VERSION + "_placeholder")),
    isSelectable: false
  }), _defineProperty(_ImmutableMap5, EVENT_BASED_FIELD_KEYS.EVENT_DATE, {
    field: makeEventDateField(DSAssetFamilies.CTA),
    isSelectable: true
  }), _defineProperty(_ImmutableMap5, EVENT_BASED_FIELD_KEYS.EVENT_COUNT, {
    field: makeEventCountField(DSAssetFamilies.CTA),
    isSelectable: true
  }), _ImmutableMap5));
};

var getBehavioralEventFields = function getBehavioralEventFields(data) {
  var _ImmutableMap6;

  return ImmutableMap((_ImmutableMap6 = {}, _defineProperty(_ImmutableMap6, EVENT_BASED_FIELD_KEYS.EVENT_STATUS, {
    field: makeEventStatusField(DSAssetFamilies.EVENT, EnumerationDisplayType),
    isSelectable: false
  }), _defineProperty(_ImmutableMap6, EVENT_BASED_FIELD_KEYS.EVENT_SUBJECT, {
    field: makeEventSubjectField(DSAssetFamilies.EVENT, data, I18n.text("newCustomerDataFilters.specialFields.EVENT." + EVENT_BASED_FIELD_KEYS.EVENT_SUBJECT + "_placeholder")),
    isSelectable: false
  }), _defineProperty(_ImmutableMap6, EVENT_BASED_FIELD_KEYS.EVENT_DATE, {
    field: makeEventDateField(DSAssetFamilies.EVENT),
    isSelectable: true
  }), _defineProperty(_ImmutableMap6, EVENT_BASED_FIELD_KEYS.EVENT_COUNT, {
    field: makeEventCountField(DSAssetFamilies.EVENT),
    isSelectable: true
  }), _ImmutableMap6));
};

export var getEventBasedFilterFamilyFields = function getEventBasedFilterFamilyFields(filterFamily) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableMap();
  var condition = arguments.length > 2 ? arguments[2] : undefined;
  var onlySelectableFields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var fieldsMap = ImmutableMap();

  if (filterFamily === DSAssetFamilies.PAGE_VIEW) {
    fieldsMap = getPageViewFields(data);
  }

  if (filterFamily === DSAssetFamilies.FORM) {
    fieldsMap = getFormSubmissionFields(data);
  }

  if (filterFamily === DSAssetFamilies.EMAIL_CAMPAIGN) {
    fieldsMap = getEmailCampaignFields(data);
  }

  if (filterFamily === DSAssetFamilies.EMAIL_SUBSCRIPTION) {
    fieldsMap = getEmailSubscriptionFields(data);
  }

  if (filterFamily === DSAssetFamilies.CTA) {
    fieldsMap = getCTAFields(data, condition);
  }

  if (filterFamily === DSAssetFamilies.EVENT) {
    fieldsMap = getBehavioralEventFields(data);
  }

  return fieldsMap.filter(function (item) {
    return onlySelectableFields ? item.isSelectable : true;
  }).map(function (item) {
    return item.field;
  });
};
export var isRefinableExtra = function isRefinableExtra(filterFamily) {
  return REFINABLE_EXTRA_FILTER_FAMILIES.includes(filterFamily);
};
export var getBaseEventBasedFilterFamilyField = function getBaseEventBasedFilterFamilyField(filterFamily) {
  var filterFamilyFields = getEventBasedFilterFamilyFields(filterFamily);
  return filterFamilyFields.get(EVENT_BASED_FIELD_KEYS.EVENT_STATUS);
};
export var getDefaultEventBasedFilterFamilyConditionField = function getDefaultEventBasedFilterFamilyConditionField(filterFamily) {
  if (filterFamily === DSAssetFamilies.FORM) {
    return AnyFormSubmissionField();
  }

  if (filterFamily === DSAssetFamilies.PAGE_VIEW) {
    return PageViewField();
  }

  if (filterFamily === DSAssetFamilies.EMAIL_SUBSCRIPTION) {
    return EmailSubscriptionField();
  }

  return MissingField();
};
var propertyTypeToRefinementFieldNameMap = Object.freeze((_Object$freeze = {}, _defineProperty(_Object$freeze, PropertyTypes.DATE, EVENT_BASED_FIELD_KEYS.EVENT_DATE), _defineProperty(_Object$freeze, PropertyTypes.NUMBER, EVENT_BASED_FIELD_KEYS.EVENT_COUNT), _Object$freeze));
export var getRefinementCondition = function getRefinementCondition(filterFamily, refinement) {
  if (refinement) {
    var type = refinement.field.type;
    var fieldName = propertyTypeToRefinementFieldNameMap[type];
    var filterFamilyFields = getEventBasedFilterFamilyFields(filterFamily);
    var refinementField = filterFamilyFields.get(fieldName);
    return refinement.set('field', refinementField);
  }

  return undefined;
};
export var shouldAddEventPageRefinement = function shouldAddEventPageRefinement(filterFamily, fieldName) {
  // include page field if field provided is a page field
  if (fieldName === EVENT_BASED_FIELD_KEYS.EVENT_PAGE) {
    return true;
  }

  return false;
};
export var isConditionsPseudoGroup = function isConditionsPseudoGroup(filterFamily) {
  var conditionsPseudoGroups = [DSAssetFamilies.FORM, DSAssetFamilies.PAGE_VIEW, DSAssetFamilies.EMAIL_CAMPAIGN, DSAssetFamilies.EMAIL_SUBSCRIPTION, DSAssetFamilies.CTA, DSAssetFamilies.EVENT];
  return conditionsPseudoGroups.includes(filterFamily);
};