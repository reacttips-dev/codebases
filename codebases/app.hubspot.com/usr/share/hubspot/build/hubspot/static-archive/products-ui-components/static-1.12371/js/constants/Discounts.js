'use es6';

import memoize from 'transmute/memoize';
export var PERCENT = 'percentage';
export var FIXED = 'fixed';
export var getDiscountOptions = memoize(function (currencyCode) {
  return [{
    text: '%',
    value: PERCENT
  }, {
    text: currencyCode,
    value: FIXED
  }];
});