'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap, _ImmutableMap2;

import * as ObjectTypes from 'customer-data-objects/constants/ObjectTypes';
import * as OperatorTypes from './FilterContactSearchOperatorTypes';
import * as Operators from '../../filterQueryFormat/operator/Operators';
import * as PropertyTypes from 'customer-data-objects/property/PropertyTypes';
import { BACKWARD, FORWARD } from 'customer-data-filters/filterQueryFormat/rollingDates/RollingDateDirections';
import { ESCAPED_RESERVE_WORDS, RESERVE_WORDS } from './constants';
import { List, Map as ImmutableMap, Seq } from 'immutable';
import And from '../../filterQueryFormat/logic/And';
import MissingField from '../../filterQueryFormat/MissingField';
import RollingDateConfig from 'customer-data-filters/filterQueryFormat/rollingDates/RollingDateConfig';
import curry from 'transmute/curry';
import getIn from 'transmute/getIn';
import identity from 'transmute/identity';
import invariant from 'react-utils/invariant';
import isString from 'transmute/isString';
import partial from 'transmute/partial';
import protocol from 'transmute/protocol';
var TypeToOperator = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, OperatorTypes.EQUAL, Operators.Equal), _defineProperty(_ImmutableMap, OperatorTypes.GREATER_OR_EQUAL, Operators.GreaterOrEqual), _defineProperty(_ImmutableMap, OperatorTypes.GREATER, Operators.Greater), _defineProperty(_ImmutableMap, OperatorTypes.IN_RANGE_ROLLING, Operators.InRollingDateRange), _defineProperty(_ImmutableMap, OperatorTypes.IN_RANGE, Operators.InRange), _defineProperty(_ImmutableMap, OperatorTypes.IN, Operators.In), _defineProperty(_ImmutableMap, OperatorTypes.KNOWN, Operators.Known), _defineProperty(_ImmutableMap, OperatorTypes.LESS_OR_EQUAL, Operators.LessOrEqual), _defineProperty(_ImmutableMap, OperatorTypes.LESS, Operators.Less), _defineProperty(_ImmutableMap, OperatorTypes.NEAR, Operators.Near), _defineProperty(_ImmutableMap, OperatorTypes.NOT_EQUAL, Operators.NotEqual), _defineProperty(_ImmutableMap, OperatorTypes.NOT_IN, Operators.NotIn), _defineProperty(_ImmutableMap, OperatorTypes.NOT_KNOWN, Operators.NotKnown), _defineProperty(_ImmutableMap, OperatorTypes.TIME_UNIT_TO_DATE, Operators.InRollingDateRange), _ImmutableMap));
var defaultConvertTo = curry(function (type, operator) {
  var result = {
    operator: type,
    property: operator.field.name
  };

  if (operator.has('highValue')) {
    result.highValue = operator.highValue;
  }

  if (operator.has('value')) {
    result.value = operator.value;
  }

  if (operator.field.type === PropertyTypes.STRING && [Operators.WildCardEqual, Operators.NotWildCardEqual].includes(operator.constructor)) {
    result.value = operator.value.filter(identity).map(function () {
      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var safeValue = str.trim();

      if (RESERVE_WORDS.includes(safeValue)) {
        safeValue = "\"" + safeValue + "\"";
      }

      return safeValue;
    }).join(' OR ');
  }

  if (operator.field.type === PropertyTypes.BOOLEAN && operator.has('value')) {
    result.value = operator.value ? 'true' : 'false';
  }

  if (![Operators.Known, Operators.NotKnown].includes(operator.constructor) && [PropertyTypes.DATE, PropertyTypes.DATE_TIME].includes(operator.field.type)) {
    result.dateTimeFormat = 'DATE';
  }

  return result;
});
var convertToIn = curry(function (type, operator) {
  return {
    operator: type,
    property: operator.field.name,
    values: operator.value.toArray()
  };
});
var convertToInRangeRolling = curry(function (type, operator) {
  var _operator$value = operator.value,
      direction = _operator$value.direction,
      includeFutureDates = _operator$value.includeFutureDates,
      useFiscalYear = _operator$value.useFiscalYear,
      isInclusive = _operator$value.isInclusive,
      timeUnit = _operator$value.timeUnit,
      value = _operator$value.value;
  var operatorType = includeFutureDates ? type : OperatorTypes.TIME_UNIT_TO_DATE;
  var filter = {
    operator: operatorType,
    property: operator.field.name,
    inclusive: isInclusive,
    rollForward: direction === FORWARD,
    timeUnit: timeUnit,
    timeUnitCount: value
  };

  if (operator.rollingOffset) {
    filter.rollingOffset = operator.rollingOffset;
  }

  if (useFiscalYear) {
    filter.rollingOffset = '__hs__FISCAL_YEAR_OFFSET';
    filter.rollingOffsetUnit = 'MONTH';
  }

  return filter;
});
var convertToNear = curry(function (type, operator) {
  return {
    distanceUnit: 'MILES',
    distanceUnitCount: 25,
    operator: type,
    property: operator.field.name,
    value: operator.value
  };
});

var invalidOperator = function invalidOperator(operator) {
  invariant(false, 'cannot convert filter operator "%s" to ContactSearch filter', operator.name);
};

var convertToContactSearch = protocol({
  name: 'convertToContactSearch',
  args: [protocol.TYPE, isString],
  fallback: invalidOperator
});
convertToContactSearch.implement(Operators.Equal, defaultConvertTo(OperatorTypes.EQUAL));
convertToContactSearch.implement(Operators.GreaterOrEqual, defaultConvertTo(OperatorTypes.GREATER_OR_EQUAL));
convertToContactSearch.implement(Operators.Greater, defaultConvertTo(OperatorTypes.GREATER));
convertToContactSearch.implement(Operators.InRange, defaultConvertTo(OperatorTypes.IN_RANGE));
convertToContactSearch.implement(Operators.In, convertToIn(OperatorTypes.IN));
convertToContactSearch.implement(Operators.InRollingDateRange, convertToInRangeRolling(OperatorTypes.IN_RANGE_ROLLING));
convertToContactSearch.implement(Operators.Known, defaultConvertTo(OperatorTypes.KNOWN));
convertToContactSearch.implement(Operators.Less, defaultConvertTo(OperatorTypes.LESS));
convertToContactSearch.implement(Operators.LessOrEqual, defaultConvertTo(OperatorTypes.LESS_OR_EQUAL));
convertToContactSearch.implement(Operators.Near, convertToNear(OperatorTypes.NEAR));
convertToContactSearch.implement(Operators.NotEqual, defaultConvertTo(OperatorTypes.NOT_EQUAL));
convertToContactSearch.implement(Operators.NotIn, convertToIn(OperatorTypes.NOT_IN));
convertToContactSearch.implement(Operators.NotKnown, defaultConvertTo(OperatorTypes.NOT_KNOWN));
convertToContactSearch.implement(Operators.WildCardEqual, defaultConvertTo(OperatorTypes.EQUAL));
convertToContactSearch.implement(Operators.NotWildCardEqual, defaultConvertTo(OperatorTypes.NOT_EQUAL));
/**
 * `null` as a value can cause a whole bunch of issues so
 * lets always convert it over to a string.
 */

function convertNullToString(value) {
  return value === null ? 'null' : value;
}

function convertStringToBool(value) {
  return typeof value === 'string' ? value === 'true' : value;
}

export function toContactSearch(filter) {
  return filter.conditions.reduce(function (acc, op) {
    acc.push(convertToContactSearch(op));
    return acc;
  }, []);
}

function defaultConvertFrom(Operator, field, entry) {
  var value = entry.value;
  var safeValue = field.type === PropertyTypes.BOOLEAN ? convertStringToBool(value) : convertNullToString(value);

  if (field.type === PropertyTypes.STRING && [Operators.Equal, Operators.NotEqual].includes(Operator)) {
    var values = value ? List(value.split(' OR ').map(convertNullToString)).map(function (v) {
      return ESCAPED_RESERVE_WORDS.includes(v) ? v.replace(/"/g, '') : v;
    }) : List();
    var RealOperator = Operator === Operators.Equal ? Operators.WildCardEqual : Operators.NotWildCardEqual;
    return RealOperator.ofUnsafe(field, values);
  }

  return Operator.ofUnsafe(field, safeValue);
}
/**
 * A while back I messed up and allowed listMemberships to have multiple values
 * in an Equal/NotEqual operator which just doesn't work. This converts to an
 * IN/NOT_IN which actually works. -Colby
 */


function convertWithOverride(OverrideOperator, Operator, field, operator) {
  var property = operator.property,
      value = operator.value;

  switch (property) {
    case 'listMemberships.listId':
    case 'ilsListMemberships.listId':
      return OverrideOperator.of(field, List(Array.isArray(value) ? value : value.split(',')));

    default:
      return defaultConvertFrom(Operator, field, operator);
  }
}

function convertFromIn(Operator, field, entry) {
  var values = entry.values;
  var operatorValues = values ? List(values.map(convertNullToString)) : List();
  return Operator.of(field, operatorValues);
}

function convertFromInRange(Operator, field, opts) {
  // Accept legacy field in addition to new one (#343)
  var highValueLegacy = opts['high_value'],
      highValue = opts.highValue,
      value = opts.value;
  return Operator.of(field, value, highValue || highValueLegacy);
}

function convertFromInRangeRolling(Operator, field, _ref) {
  var _ref$inclusive = _ref.inclusive,
      inclusive = _ref$inclusive === void 0 ? false : _ref$inclusive,
      operator = _ref.operator,
      _ref$rollForward = _ref.rollForward,
      rollForward = _ref$rollForward === void 0 ? false : _ref$rollForward,
      _ref$rollingOffset = _ref.rollingOffset,
      rollingOffset = _ref$rollingOffset === void 0 ? 0 : _ref$rollingOffset,
      timeUnit = _ref.timeUnit,
      timeUnitCount = _ref.timeUnitCount;
  var direction = rollForward === true ? FORWARD : BACKWARD;
  var includeFutureDates = operator === OperatorTypes.IN_RANGE_ROLLING;
  var useFiscalYear = rollingOffset === '__hs__FISCAL_YEAR_OFFSET';
  return Operator.of(field, RollingDateConfig({
    direction: direction,
    includeFutureDates: includeFutureDates,
    useFiscalYear: useFiscalYear,
    isInclusive: inclusive,
    timeUnit: timeUnit,
    value: timeUnitCount
  }), useFiscalYear ? 0 : rollingOffset);
}

var convertFromContactSearch = ImmutableMap((_ImmutableMap2 = {}, _defineProperty(_ImmutableMap2, OperatorTypes.EQUAL, partial(convertWithOverride, Operators.In)), _defineProperty(_ImmutableMap2, OperatorTypes.GREATER, defaultConvertFrom), _defineProperty(_ImmutableMap2, OperatorTypes.GREATER_OR_EQUAL, defaultConvertFrom), _defineProperty(_ImmutableMap2, OperatorTypes.IN, convertFromIn), _defineProperty(_ImmutableMap2, OperatorTypes.IN_RANGE, convertFromInRange), _defineProperty(_ImmutableMap2, OperatorTypes.IN_RANGE_ROLLING, convertFromInRangeRolling), _defineProperty(_ImmutableMap2, OperatorTypes.KNOWN, defaultConvertFrom), _defineProperty(_ImmutableMap2, OperatorTypes.LESS, defaultConvertFrom), _defineProperty(_ImmutableMap2, OperatorTypes.LESS_OR_EQUAL, defaultConvertFrom), _defineProperty(_ImmutableMap2, OperatorTypes.NEAR, defaultConvertFrom), _defineProperty(_ImmutableMap2, OperatorTypes.NOT_EQUAL, partial(convertWithOverride, Operators.NotIn)), _defineProperty(_ImmutableMap2, OperatorTypes.NOT_IN, convertFromIn), _defineProperty(_ImmutableMap2, OperatorTypes.NOT_KNOWN, defaultConvertFrom), _defineProperty(_ImmutableMap2, OperatorTypes.TIME_UNIT_TO_DATE, convertFromInRangeRolling), _ImmutableMap2));
export function fromContactSearch(fields, json) {
  var defaultFilterFamily = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ObjectTypes.CONTACT;
  // HACK: shim for CRM-Issues#955 transition
  var getField = typeof fields === 'function' ? fields : function (keyPath) {
    return getIn(keyPath, fields);
  };

  if (!fields || !json) {
    return And();
  }

  var convertEntry = function convertEntry(filterFamily, entry) {
    var Operator = TypeToOperator.get(entry.operator);
    invariant(Operator !== undefined, 'contact search operator `%s` is not defined in OperatorConversion', entry.operator);
    var converter = convertFromContactSearch.get(entry.operator);
    invariant(typeof converter === 'function', 'no converter defined from `%s` to `%s` operator', entry.operator, Operator.toString());
    var fieldRecord = getField([filterFamily, entry.property]) || getField([entry.property]) || MissingField({
      name: entry.property,
      type: PropertyTypes[entry.dateTimeFormat] || PropertyTypes.STRING
    });
    return converter(Operator, fieldRecord, entry);
  };

  var entries = Seq(json).map(function (entry) {
    return convertEntry(entry.filterFamily || defaultFilterFamily, entry);
  });
  return And.of.apply(And, _toConsumableArray(entries)).set('filterFamily', defaultFilterFamily);
}