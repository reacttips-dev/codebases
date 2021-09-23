'use es6';

import { List } from 'immutable';
import responseTooLarge from './responseTooLarge';
import tooManyBreakdowns from './tooManyBreakdowns';
var PRECONDITIONS = {
  generate: [],
  transform: [responseTooLarge, tooManyBreakdowns]
};

var check = function check(input, preconditions) {
  return Promise.all(preconditions.map(function (precondition) {
    return precondition(input);
  }));
};

export var generate = function generate(config) {
  var preconditions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : PRECONDITIONS.generate;
  return check(config, preconditions);
};
export var transform = function transform(response) {
  var preconditions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : PRECONDITIONS.transform;
  return List.isList(response) ? response.forEach(function (dataset) {
    return check(dataset, preconditions);
  }) : check(response, preconditions);
};