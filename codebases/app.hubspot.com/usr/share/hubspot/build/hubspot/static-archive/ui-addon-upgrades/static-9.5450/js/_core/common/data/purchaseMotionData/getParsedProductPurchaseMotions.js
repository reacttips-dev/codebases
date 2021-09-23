'use es6';

import { getProductPurchaseMotionData } from 'self-service-api/api/getProductPurchaseMotionData';
import logError from '../../reliability/logError';
export var getParsedProductPurchaseMotions = function getParsedProductPurchaseMotions(_ref) {
  var location = _ref.location,
      apiName = _ref.apiName;
  var purchaseMotionsRequest = getProductPurchaseMotionData({
    locations: [location],
    apiNames: [apiName]
  });
  return purchaseMotionsRequest({
    location: location,
    apiName: apiName
  }).then(function (response) {
    if (!response || !response.length) {
      logError('getProductPurchaseMotionData', {
        message: 'Response is empty',
        data: {
          location: location,
          apiName: apiName,
          response: response
        }
      });
    }

    return response;
  }).catch(function (error) {
    logError('getProductPurchaseMotionData', error);
  });
};