'use es6';

import { fetchProductPurchaseMotionData } from 'self-service-api/core/api/purchaseMotionApi';
import { validateApiName } from 'self-service-api/core/validators';
import { productPurchaseMotionsAdapter } from '../adapters/productPurchaseMotionsAdapter';
export var getLocationAwareProductPurchaseMotionData = function getLocationAwareProductPurchaseMotionData(_ref) {
  var _ref$apiNames = _ref.apiNames,
      apiNames = _ref$apiNames === void 0 ? [] : _ref$apiNames,
      locations = _ref.locations,
      apiGetter = _ref.apiGetter;
  apiNames.forEach(validateApiName);
  return fetchProductPurchaseMotionData({
    apiNames: apiNames,
    locations: locations,
    apiGetter: apiGetter
  });
};
export var getProductPurchaseMotionData = function getProductPurchaseMotionData(_ref2) {
  var apiNames = _ref2.apiNames,
      _ref2$locations = _ref2.locations,
      locations = _ref2$locations === void 0 ? [] : _ref2$locations,
      apiGetter = _ref2.apiGetter;
  return function (_ref3) {
    var location = _ref3.location,
        apiName = _ref3.apiName;
    return getLocationAwareProductPurchaseMotionData({
      apiNames: apiNames,
      locations: locations,
      apiGetter: apiGetter
    }).then(function (purchaseMotionData) {
      return productPurchaseMotionsAdapter(purchaseMotionData, location, apiName);
    });
  };
};