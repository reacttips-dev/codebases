'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { List } from 'immutable';
import getInboundDbPropertyGroups from '../../retrieve/inboundDb/common/properties';
import { ATTRIBUTION_TOUCH_POINTS } from '../../constants/dataTypes';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import countProperty from '../partial/count-property';
export var getPropertyGroups = function getPropertyGroups() {
  return getInboundDbPropertyGroups(ATTRIBUTION_TOUCH_POINTS).then(function (groups) {
    return List(_toConsumableArray(groups));
  });
}; // TODO: Remove overrides once attribution property types are changed in the backend

export var getProperties = function getProperties() {
  return createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
    return properties.merge(countProperty(ATTRIBUTION_TOUCH_POINTS));
  })();
};