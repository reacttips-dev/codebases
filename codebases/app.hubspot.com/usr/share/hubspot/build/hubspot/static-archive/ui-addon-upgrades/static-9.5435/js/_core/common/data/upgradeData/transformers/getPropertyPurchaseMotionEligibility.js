'use es6';

import { getPurchaseMotionData } from 'self-service-api/api/getPurchaseMotionData';
import { ENTERPRISE } from 'self-service-api/constants/UpgradeProducts';
import UpgradeProductProperties from 'self-service-api/constants/UpgradeProductProperties';
import { createProperty } from 'ui-addon-upgrades/_core/common/data/upgradeData/transformers/createProperty';
import * as PurchaseMotionTypes from 'ui-addon-upgrades/_core/purchaseMotions/PurchaseMotionTypes';
import { PRODUCT_MARKETING_ENTERPRISE } from 'self-service-api/constants/MerchandiseIds';
import logError from 'ui-addon-upgrades/_core/common/reliability/logError';
var PROPERTY_KEY = 'purchaseMotionEligibility';
/**
 * @deprecated as part of product abstraction
 */

export var getPropertyPurchaseMotionEligibility = function getPropertyPurchaseMotionEligibility() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      upgradeProduct = _ref.upgradeProduct;

  var productProperty = UpgradeProductProperties[upgradeProduct];

  if (!productProperty) {
    return createProperty(PROPERTY_KEY, []);
  }

  var merchandiseId = UpgradeProductProperties[upgradeProduct].merchandiseId;

  if (!merchandiseId) {
    // An upgradeProduct will not have an associated merchandiseId if
    // it is a concept that we've created rather than an actual SKU. I.e. GENERAL
    return createProperty(PROPERTY_KEY, [PurchaseMotionTypes.TALK_TO_SALES]);
  }

  var merchandiseIdToUse = merchandiseId; //Enterprise upgrade product can be used when a feature can be unlocked by any enterprise SKU
  // Use Marketing Enterprise as a proxy for purchase motion eligibility of enterprise level SKUs

  if (upgradeProduct === ENTERPRISE) {
    merchandiseIdToUse = PRODUCT_MARKETING_ENTERPRISE;
  }

  return getPurchaseMotionData([merchandiseIdToUse]).then(function (purchaseMotionData) {
    var purchaseMotionEligibility = purchaseMotionData.purchaseMotions[merchandiseIdToUse] || [];
    var propertyValue = purchaseMotionEligibility.map(function () {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          key = _ref2.key;

      return key;
    });
    return createProperty(PROPERTY_KEY, propertyValue);
  }).catch(function (err) {
    logError('getPropertyPurchaseMotionEligibility', err);
    return createProperty(PROPERTY_KEY, []);
  });
};