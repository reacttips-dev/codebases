'use es6';

export var productPurchaseMotionsAdapter = function productPurchaseMotionsAdapter(purchaseMotionData, location, apiName) {
  var purchaseMotionDataByLocation = purchaseMotionData && purchaseMotionData.locations && purchaseMotionData.locations[location];
  var purchaseMotions = purchaseMotionDataByLocation && purchaseMotionDataByLocation.purchaseMotions && purchaseMotionDataByLocation.purchaseMotions[apiName];
  var parsedPurchaseMotions = purchaseMotions ? purchaseMotions.map(function () {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return obj.key;
  }) : [];
  return parsedPurchaseMotions;
};