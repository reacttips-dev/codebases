'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _propertyTranslatorNa;

import { List } from 'immutable';
import { propertyLabelTranslator, propertyLabelTranslatorWithIsHubSpotDefined } from 'property-translator/propertyTranslator';
import { ATTRIBUTION_TOUCH_POINTS, COMPANIES, CONTACTS, CONTACT_CREATE_ATTRIBUTION, DEALS, DEAL_CREATE_ATTRIBUTION, ENGAGEMENTS, FEEDBACK_SUBMISSIONS, LINE_ITEMS, PRODUCTS, QUOTAS, SOCIAL_POSTS, TICKETS } from '../../../../constants/dataTypes';
import { DATA_TYPE_TO_HUBSPOT_OBJECT_COORDINATES } from '../../../../constants/objectCoordinates';
import { MissingPropertiesException } from '../../../../exceptions';
import { Promise } from '../../../../lib/promise';
import * as http from '../../../../request/http';
var STANDARD_URL_DATA_TYPES = List([ATTRIBUTION_TOUCH_POINTS, CONTACT_CREATE_ATTRIBUTION, CONTACTS, COMPANIES, DEAL_CREATE_ATTRIBUTION, DEALS, ENGAGEMENTS, FEEDBACK_SUBMISSIONS, LINE_ITEMS, PRODUCTS, QUOTAS, TICKETS]);

var NON_STANDARD_URLS = _defineProperty({}, SOCIAL_POSTS, 'social-reporting/v1/report/posts/groups');

var QUERY = {
  includeProperties: true
};
var V4_PROPS_URLS = 'properties/v4/groups/';

var fetchProperties = function fetchProperties(dataType) {
  var dataTypeId = DATA_TYPE_TO_HUBSPOT_OBJECT_COORDINATES.get(dataType, dataType);
  return http.get("" + V4_PROPS_URLS + dataTypeId, {
    query: QUERY
  });
};

var fetchNonStandardProperties = function fetchNonStandardProperties(dataType) {
  return http.get(NON_STANDARD_URLS[dataType], {
    query: QUERY
  });
};

var propertyTranslatorNamespaces = (_propertyTranslatorNa = {}, _defineProperty(_propertyTranslatorNa, ATTRIBUTION_TOUCH_POINTS, 'attributionProperties'), _defineProperty(_propertyTranslatorNa, CONTACT_CREATE_ATTRIBUTION, 'contactCreateAttributionProperties'), _defineProperty(_propertyTranslatorNa, DEAL_CREATE_ATTRIBUTION, 'dealCreateAttributionProperties'), _propertyTranslatorNa);

var translateProperties = function translateProperties(propertyGroups, dataType) {
  return propertyGroups.map(function (group) {
    return group.update('displayName', propertyLabelTranslator).update('properties', function (properties) {
      return properties.map(function (property) {
        var translated = property.update('label', function (label) {
          return propertyLabelTranslatorWithIsHubSpotDefined({
            label: label,
            nameSpaceLookupKey: propertyTranslatorNamespaces[dataType],
            isHubSpotDefined: property.get('hubspotDefined')
          });
        });
        return property.has('options') ? translated.update('options', function (options) {
          return options.map(function (option) {
            return option.update('label', function (label) {
              return propertyLabelTranslatorWithIsHubSpotDefined({
                label: label,
                nameSpaceLookupKey: propertyTranslatorNamespaces[dataType],
                isHubSpotDefined: property.get('hubspotDefined')
              });
            });
          });
        }) : translated;
      });
    });
  });
};

export default (function (dataType) {
  if (NON_STANDARD_URLS.hasOwnProperty(dataType)) {
    fetchNonStandardProperties(dataType).then(function (propertyGroups) {
      return translateProperties(propertyGroups, dataType);
    });
  }

  return STANDARD_URL_DATA_TYPES.includes(dataType) ? fetchProperties(dataType).then(function (response) {
    var propertyGroups = response.get('results', List());
    return translateProperties(propertyGroups, dataType);
  }) : Promise.reject(new MissingPropertiesException(dataType));
});