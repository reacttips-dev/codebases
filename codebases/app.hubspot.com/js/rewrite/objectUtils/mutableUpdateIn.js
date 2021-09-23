'use es6';

import getIn from 'transmute/getIn';
import curry from 'transmute/curry';
import { mutableSetIn } from './mutableSetIn';
export var mutableUpdateIn = curry(function (keyPath, updater, obj) {
  var currentValue = getIn(keyPath, obj);
  mutableSetIn(keyPath, updater(currentValue), obj);
});