'use es6';

import * as PurchaseMotionTypes from '../purchaseMotions/PurchaseMotionTypes';
export var getSeatedPurchaseMotion = function getSeatedPurchaseMotion(purchaseMotions) {
  var purchaseMotion = purchaseMotions && purchaseMotions[0] || null;
  var isSeatedPurchaseMotion = purchaseMotion === PurchaseMotionTypes.ASSIGN_SEAT || purchaseMotion === PurchaseMotionTypes.REQUEST_SEAT;
  return isSeatedPurchaseMotion ? purchaseMotion : null;
};