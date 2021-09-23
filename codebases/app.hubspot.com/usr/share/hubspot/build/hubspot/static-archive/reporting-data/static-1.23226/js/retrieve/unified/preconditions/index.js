'use es6';

import { Promise } from '../../../lib/promise';
import { get as responseSize } from './response-size';
var preconditions = [responseSize];
export var get = function get(spec, config) {
  return function (response) {
    preconditions.forEach(function (condition) {
      return condition(spec, config)(response);
    });
    return Promise.resolve(response);
  };
};