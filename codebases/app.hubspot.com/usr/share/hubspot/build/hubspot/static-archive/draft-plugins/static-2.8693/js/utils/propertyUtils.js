'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ToObjectType;

import I18n from 'I18n';
import { Map as ImmutableMap } from 'immutable';
import memoize from 'transmute/memoize';
import unescapedText from 'I18n/utils/unescapedText';
var CONTACT = 'contact';
var COMPANY = 'company';
var DEAL = 'deal';
var TICKET = 'ticket';
var QUOTE = 'quote';
var ENGAGEMENT = 'engagement';
var LINE_ITEM = 'line_item';
var UNKNOWN = 'unknown';
var CONTACT_ID = '0-1';
var COMPANY_ID = '0-2';
var DEAL_ID = '0-3';
var TICKET_ID = '0-5';
var QUOTE_ID = '0-14';
var ENGAGEMENT_ID = '0-4';
var LINE_ITEM_ID = '0-8';
var UNKNOWN_ID = '0-0';
export var ToObjectType = (_ToObjectType = {}, _defineProperty(_ToObjectType, UNKNOWN_ID, UNKNOWN), _defineProperty(_ToObjectType, CONTACT_ID, CONTACT), _defineProperty(_ToObjectType, COMPANY_ID, COMPANY), _defineProperty(_ToObjectType, DEAL_ID, DEAL), _defineProperty(_ToObjectType, TICKET_ID, TICKET), _defineProperty(_ToObjectType, QUOTE_ID, QUOTE), _defineProperty(_ToObjectType, ENGAGEMENT_ID, ENGAGEMENT), _defineProperty(_ToObjectType, LINE_ITEM_ID, LINE_ITEM), _ToObjectType);
export var toI18nText = function toI18nText(name) {
  return I18n.text("draftPlugins.mergeTags.missingMergeTags." + name);
};

var _flattenPropertyList = function _flattenPropertyList(propertyLists) {
  return propertyLists.reduce(function (propertyMap, propertyListData) {
    return propertyListData.get('properties').reduce(function (updatedPropertyMap, property) {
      var _property$toObject = property.toObject(),
          name = _property$toObject.name,
          label = _property$toObject.label;

      return updatedPropertyMap.set(name, label);
    }, propertyMap);
  }, ImmutableMap());
};

export var flattenPropertyList = memoize(_flattenPropertyList);
export var escapePlaceholderProperty = function escapePlaceholderProperty(property) {
  return property.replace(/\s/g, '_');
};
export var unescapePlaceholderProperty = function unescapePlaceholderProperty(property) {
  return property.replace(/_/g, ' ');
};
export var cleanPlaceholderProperty = function cleanPlaceholderProperty(token) {
  return token.replace(/[_{}&<>"`;()\\.,]/g, '');
};
var CUSTOM_ID_REGEX = /(0-\d+)/;
export var isCustomObjectId = function isCustomObjectId(prefix) {
  return CUSTOM_ID_REGEX.test(prefix);
};
export var getPrefixId = function getPrefixId(customObjectPrefix) {
  return CUSTOM_ID_REGEX.exec(customObjectPrefix)[0];
};
export var formatMergeTag = function formatMergeTag(prefix, property, properties) {
  var translatablePrefix = prefix;

  if (isCustomObjectId(prefix)) {
    var prefixId = getPrefixId(prefix);
    translatablePrefix = ToObjectType[prefixId];
  }

  var propertyType = prefix + "Properties";
  var propertiesForType = properties.get(propertyType);
  var canInferPropertyType = !!propertiesForType;

  if (canInferPropertyType) {
    // if no property for type we assume it's part of a placeholder token
    var propertyLabel = propertiesForType.get(property) || unescapePlaceholderProperty(property);
    return unescapedText('draftPlugins.mergeTagGroupPlugin.tagLabel', {
      propertyType: toI18nText(translatablePrefix),
      propertyLabel: propertyLabel
    });
  } else {
    return toI18nText('unknown');
  }
};
export var resolveLabelFromProperties = function resolveLabelFromProperties(prefix, property, properties) {
  var propertyType = prefix + "Properties";
  var propertiesForType = properties.get(propertyType);
  var canInferPropertyType = !!propertiesForType;

  if (canInferPropertyType) {
    return propertiesForType.get(property);
  }

  return toI18nText('missingLabel');
};