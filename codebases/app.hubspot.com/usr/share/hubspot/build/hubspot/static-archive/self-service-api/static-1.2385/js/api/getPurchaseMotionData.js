'use es6';

import { fetchPurchaseMotionData, fetchLocationAwarePurchaseMotionData } from 'self-service-api/core/api/purchaseMotionApi';
import { validateMerchandiseId } from 'self-service-api/core/validators';
import availableTrialsAdapter from 'self-service-api/adapters/availableTrialsAdapter';
import { locationAwarePurchaseMotionsAdapter } from '../adapters/locationAwarePurchaseMotionsAdapter';
/**
 * @deprecated as part of product abstraction, prefer _adaptProductPurchaseMotionResponse
 */

var _adaptPurchaseMotionResponse = function _adaptPurchaseMotionResponse(purchaseMotionMetaData) {
  var availableTrials = purchaseMotionMetaData.availableTrials,
      customerCurrencyCode = purchaseMotionMetaData.customerCurrencyCode,
      productBasedOffers = purchaseMotionMetaData.productBasedOffers,
      parcels = purchaseMotionMetaData.parcels,
      subscriptionTerms = purchaseMotionMetaData.subscriptionTerms,
      merchandiseIdsTreatedAsOwned = purchaseMotionMetaData.merchandiseIdsTreatedAsOwned;
  return {
    availableTrials: availableTrialsAdapter(availableTrials),
    customerCurrencyCode: customerCurrencyCode,
    productBasedOffers: productBasedOffers,
    parcels: parcels,
    subscriptionTerms: subscriptionTerms,
    merchandiseIdsTreatedAsOwned: merchandiseIdsTreatedAsOwned
  };
};
/**
 * @deprecated as part of product abstraction
 */


export var getPurchaseMotionData = function getPurchaseMotionData() {
  var merchandiseIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  merchandiseIds.forEach(validateMerchandiseId);
  return fetchPurchaseMotionData(merchandiseIds).then(function (purchaseMotionData) {
    return Object.assign({}, _adaptPurchaseMotionResponse(purchaseMotionData), {
      purchaseMotions: purchaseMotionData.purchaseMotions
    });
  });
};
/**
 * @deprecated as part of product abstraction, prefer getLocationAwareProductPurchaseMotionData
 */

export var getLocationAwarePurchaseMotionData = function getLocationAwarePurchaseMotionData(_ref) {
  var _ref$merchandiseIds = _ref.merchandiseIds,
      merchandiseIds = _ref$merchandiseIds === void 0 ? [] : _ref$merchandiseIds,
      locations = _ref.locations,
      apiGetter = _ref.apiGetter,
      _ref$fetchMetaData = _ref.fetchMetaData,
      fetchMetaData = _ref$fetchMetaData === void 0 ? true : _ref$fetchMetaData;

  if (!locations || locations.length === 0) {
    throw new Error('Need to specify location');
  }

  merchandiseIds.forEach(validateMerchandiseId);
  return fetchLocationAwarePurchaseMotionData({
    merchandiseIds: merchandiseIds,
    locations: locations,
    apiGetter: apiGetter,
    fetchMetaData: fetchMetaData
  }).then(function (response) {
    return Object.assign({}, response, {}, fetchMetaData && {
      metadata: _adaptPurchaseMotionResponse(response.metadata)
    });
  });
};
/**
 * @deprecated as part of product abstraction, prefer getProductPurchaseMotionData
 */

export var getParsedLocationAwarePurchaseMotions = function getParsedLocationAwarePurchaseMotions(_ref2) {
  var merchandiseIds = _ref2.merchandiseIds,
      locations = _ref2.locations,
      apiGetter = _ref2.apiGetter,
      fetchMetaData = _ref2.fetchMetaData;
  return function (_ref3) {
    var location = _ref3.location,
        merchandiseId = _ref3.merchandiseId;
    return getLocationAwarePurchaseMotionData({
      merchandiseIds: merchandiseIds,
      locations: locations,
      apiGetter: apiGetter,
      fetchMetaData: fetchMetaData
    }).then(function (purchaseMotionData) {
      return locationAwarePurchaseMotionsAdapter(purchaseMotionData, location, merchandiseId);
    });
  };
};