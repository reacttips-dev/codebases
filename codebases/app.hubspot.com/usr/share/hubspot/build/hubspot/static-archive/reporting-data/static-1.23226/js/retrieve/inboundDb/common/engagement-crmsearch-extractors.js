'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { List } from 'immutable';
import { ENGAGEMENT_MAP_TO_SEARCH_PROPERTIES, ENGAGEMENT_TYPE_DETAILS_PROPERTY_MAP } from './mapToSearchProperties';
import normalize from './normalize';
export var engagementExtractors = Object.keys(ENGAGEMENT_MAP_TO_SEARCH_PROPERTIES).reduce(function (memo, property) {
  return Object.assign({}, memo, _defineProperty({}, property, function (object) {
    return normalize(object.getIn(['properties', ENGAGEMENT_MAP_TO_SEARCH_PROPERTIES[property], 'value'], ''));
  }));
}, {
  'engagement.details': function engagementDetails(object) {
    var engagementType = object.getIn(['properties', 'hs_engagement_type', 'value']);
    return List(ENGAGEMENT_TYPE_DETAILS_PROPERTY_MAP[engagementType]).map(function (searchProperty) {
      return normalize(object.getIn(['properties', searchProperty, 'value'], ''));
    }).filterNot(function (value) {
      return !value;
    }).first();
  }
});