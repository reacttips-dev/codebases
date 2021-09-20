'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getTypeByTrigger = function getTypeByTrigger(trigger) {
  return trigger === '@' ? 'mention' : trigger + 'mention';
};

exports.default = getTypeByTrigger;