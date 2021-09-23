'use es6';

import quickFetch from 'quick-fetch';
import http from 'hub-http/clients/apiClient';
import memoize from '../utilities/memoize';
export var fetchProductPurchaseMotionData = memoize(function (_ref) {
  var _ref$apiNames = _ref.apiNames,
      apiNames = _ref$apiNames === void 0 ? [] : _ref$apiNames,
      locations = _ref.locations,
      apiGetter = _ref.apiGetter;
  var url = '/monetization-service/v3/purchase-motions';
  var query = locations ? {
    apiName: apiNames,
    location: locations
  } : {
    apiNames: apiNames
  };

  if (!apiGetter) {
    return http.get(url, {
      query: query
    });
  }

  return new Promise(function (resolve, reject) {
    apiGetter.whenFinished(function (result) {
      resolve(result);
      quickFetch.removeEarlyRequest('purchase-motions');
    });
    apiGetter.onError(function () {
      quickFetch.removeEarlyRequest('purchase-motions');
      return http.get(url, {
        query: query
      }).then(resolve).catch(function (httpError) {
        reject(httpError);
      });
    });
  });
});
/**
 * @deprecated as part of product abstraction, prefer fetchProductPurchaseMotionData
 */

export var fetchPurchaseMotionData = memoize(function (merchandiseIds) {
  return http.post('/monetization-service/v2/purchase-motions', {
    data: {
      merchandiseIds: merchandiseIds
    }
  });
});
/**
 * @deprecated as part of product abstraction, prefer fetchProductPurchaseMotionData
 */

export var fetchLocationAwarePurchaseMotionData = memoize(function (_ref2) {
  var _ref2$merchandiseIds = _ref2.merchandiseIds,
      merchandiseIds = _ref2$merchandiseIds === void 0 ? [] : _ref2$merchandiseIds,
      locations = _ref2.locations,
      apiGetter = _ref2.apiGetter,
      _ref2$fetchMetaData = _ref2.fetchMetaData,
      fetchMetaData = _ref2$fetchMetaData === void 0 ? true : _ref2$fetchMetaData;
  var url = fetchMetaData ? '/monetization-service/v2/purchase-motions' : '/monetization-service/v2/purchase-motions/no-metadata';

  if (!apiGetter) {
    return http.get(url, {
      query: {
        merch: merchandiseIds,
        location: locations
      }
    });
  }

  return new Promise(function (resolve, reject) {
    apiGetter.whenFinished(function (result) {
      resolve(result);
      quickFetch.removeEarlyRequest('purchase-motions');
    });
    apiGetter.onError(function () {
      quickFetch.removeEarlyRequest('purchase-motions');
      return http.get(url, {
        query: {
          merch: merchandiseIds,
          location: locations
        }
      }).then(resolve).catch(function (httpError) {
        reject(httpError);
      });
    });
  });
});