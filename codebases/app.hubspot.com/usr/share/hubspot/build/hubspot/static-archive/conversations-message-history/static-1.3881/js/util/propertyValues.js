'use es6';

import curry from 'transmute/curry';
import { Map as ImmutableMap, fromJS } from 'immutable';
export var setDefaultValues = curry(function (defaults, subject) {
  return ImmutableMap(defaults).merge(subject);
});
export var enforceValues = curry(function (valuesToEnforce, subject) {
  return ImmutableMap(subject).merge(valuesToEnforce);
});
export var enforcePartialValues = curry(function (valuesToEnforce, subject) {
  return fromJS(subject).mergeDeep(valuesToEnforce);
});