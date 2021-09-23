'use es6';

import { createProperty } from 'ui-addon-upgrades/_core/common/data/upgradeData/transformers/createProperty';
import { sources } from 'ui-addon-upgrades/_core/common/data/upgradeData/properties/sources';
var PROPERTY_KEY = 'source';
/**
 * @param {Object} upgradeData
 * @param {String} upgradeSource
 * @return {Object}
 */

export var getPropertySource = function getPropertySource(_ref, upgradeSource) {
  var app = _ref.app,
      screen = _ref.screen,
      uniqueId = _ref.uniqueId;
  var propertyValue = app + "-" + screen + "-" + sources[upgradeSource] + "-" + uniqueId;
  return createProperty(PROPERTY_KEY, propertyValue);
};