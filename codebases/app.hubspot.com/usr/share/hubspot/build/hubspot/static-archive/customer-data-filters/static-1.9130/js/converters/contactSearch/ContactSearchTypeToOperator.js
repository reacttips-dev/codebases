'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import * as Operators from 'customer-data-filters/filterQueryFormat/operator/Operators';
import { BOOLEAN, DATE, DATE_TIME, ENUMERATION, NUMBER, STRING } from 'customer-data-objects/property/PropertyTypes';
import { Map as ImmutableMap, OrderedSet } from 'immutable';
var dateDefaults = OrderedSet.of(Operators.InRollingDateRange, Operators.Equal, Operators.Less, Operators.Greater, Operators.InRange, Operators.Known, Operators.NotKnown);
var ContactSearchTypeToOperator = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, BOOLEAN, OrderedSet.of(Operators.Equal, Operators.NotEqual)), _defineProperty(_ImmutableMap, DATE, dateDefaults), _defineProperty(_ImmutableMap, DATE_TIME, dateDefaults), _defineProperty(_ImmutableMap, ENUMERATION, OrderedSet.of(Operators.In, Operators.NotIn, Operators.Known, Operators.NotKnown)), _defineProperty(_ImmutableMap, NUMBER, OrderedSet.of(Operators.Equal, Operators.NotEqual, Operators.Greater, Operators.GreaterOrEqual, Operators.Less, Operators.LessOrEqual, Operators.InRange, Operators.Known, Operators.NotKnown)), _defineProperty(_ImmutableMap, STRING, OrderedSet.of(Operators.WildCardEqual, Operators.NotWildCardEqual, Operators.Known, Operators.NotKnown)), _ImmutableMap));
export var getContactSearchOperatorsForType = function getContactSearchOperatorsForType(type) {
  return ContactSearchTypeToOperator.get(type);
};