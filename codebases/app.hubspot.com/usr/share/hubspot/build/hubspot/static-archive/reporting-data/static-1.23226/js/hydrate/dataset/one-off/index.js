'use es6';

import * as feedbackCustomerTypes from './feedback-customer-types';
var oneOffs = [feedbackCustomerTypes];
export var get = function get(property, config) {
  return oneOffs.find(function (oneOff) {
    return oneOff.precondition(property, config);
  });
};