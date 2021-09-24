'use es6';

import { MARKETING_STARTER, MARKETING_STARTER_EMAIL } from 'self-service-api/constants/UpgradeProducts';
import { getPropertySource } from 'ui-addon-upgrades/_core/common/data/upgradeData/transformers/getPropertySource';
import { getPropertyRepInfo } from 'ui-addon-upgrades/_core/common/data/upgradeData/transformers/getPropertyRepInfo';
import { getPropertyPurchaseMotionEligibility } from 'ui-addon-upgrades/_core/common/data/upgradeData/transformers/getPropertyPurchaseMotionEligibility';
var RENDER_BLOCKING_PROPERTY_GETTERS = [getPropertySource];
var LAZY_LOADED_PROPERTY_GETTERS = [getPropertyRepInfo, getPropertyPurchaseMotionEligibility];

var _createUpgradeData = function _createUpgradeData(propertyGetters, upgradeData, upgradeSource) {
  var props = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var correctedUpgradeData;

  if (upgradeData.upgradeProduct === MARKETING_STARTER) {
    correctedUpgradeData = Object.assign({}, upgradeData, {
      upgradeProduct: MARKETING_STARTER_EMAIL
    });
  } else {
    correctedUpgradeData = upgradeData;
  }

  var properties = propertyGetters.map(function (propertyGetter) {
    return propertyGetter(correctedUpgradeData, upgradeSource, props);
  });
  return Promise.all(properties).then(function (propertyValues) {
    return propertyValues.reduce(function (decoratedUpgradeData, newProperty) {
      return Object.assign({}, decoratedUpgradeData, {}, newProperty);
    }, correctedUpgradeData);
  });
};

export var createRenderBlockingUpgradeData = function createRenderBlockingUpgradeData() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _createUpgradeData.apply(void 0, [RENDER_BLOCKING_PROPERTY_GETTERS].concat(args));
};
export var createLazyLoadedUpgradeData = function createLazyLoadedUpgradeData() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return _createUpgradeData.apply(void 0, [LAZY_LOADED_PROPERTY_GETTERS].concat(args));
};
export var createUpgradeData = function createUpgradeData(upgradeData, upgradeSource, props) {
  return _createUpgradeData(RENDER_BLOCKING_PROPERTY_GETTERS, upgradeData, upgradeSource, props).then(function (renderBlockingUpgradeData) {
    return _createUpgradeData(LAZY_LOADED_PROPERTY_GETTERS, renderBlockingUpgradeData, props);
  });
};