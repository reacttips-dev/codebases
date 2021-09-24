'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import * as Operators from 'customer-data-filters/filterQueryFormat/operator/Operators';
import * as PropertyTypes from 'customer-data-objects/property/PropertyTypes';
import { Map as ImmutableMap } from 'immutable';
import DefaultNullValueRecord from 'customer-data-filters/filterQueryFormat/DefaultNullValueRecord';
import MissingField from '../filterQueryFormat/MissingField';
var alwaysSupportedOperators = {
  boolean: [Operators.NotEqual, Operators.NeverEqual, Operators.NotUpdatedInLastXDays],
  datetimePropComparison: [],
  datetime: [Operators.NotInRange, Operators.NotUpdatedInLastXDays],
  enumeration: [Operators.NotIn, Operators.NeverIn, Operators.NotEqualAll, Operators.NotContainAll, Operators.NeverEqualAll, Operators.NeverContainedAll, Operators.NotUpdatedInLastXDays],
  number: [Operators.NotEqual, Operators.Less, Operators.LessOrEqual, Operators.NeverEqual, Operators.NotUpdatedInLastXDays],
  string: [Operators.NotEqualAny, Operators.NotContainAny, Operators.NeverEqualAny, Operators.NeverContained, Operators.NotUpdatedInLastXDays]
};
var ifPrevSetSupportedOperators = {
  boolean: [Operators.Equal, Operators.EverEqual],
  datetimePropComparison: [Operators.After, Operators.Before],
  datetime: [],
  enumeration: [Operators.In, Operators.EverIn],
  number: [Operators.Equal, Operators.Greater, Operators.GreaterOrEqual],
  string: [Operators.EqualAny, Operators.ContainAny]
};

var getBooleanDefaultNullValue = function getBooleanDefaultNullValue(operator) {
  return alwaysSupportedOperators.boolean.includes(operator.constructor) || ifPrevSetSupportedOperators.boolean.includes(operator.constructor) ? DefaultNullValueRecord({
    defaultValue: false
  }) : undefined;
};

var getDateDefaultNullValue = function getDateDefaultNullValue(operator) {
  if (alwaysSupportedOperators.datetimePropComparison.includes(operator.constructor) || ifPrevSetSupportedOperators.datetimePropComparison.includes(operator.constructor)) {
    return DefaultNullValueRecord({
      defaultComparisonValue: 0
    });
  }

  if (alwaysSupportedOperators.datetime.includes(operator.constructor) || ifPrevSetSupportedOperators.datetime.includes(operator.constructor)) {
    return DefaultNullValueRecord({
      defaultValue: 0
    });
  }

  return undefined;
};

var getEnumerationDefaultNullValue = function getEnumerationDefaultNullValue(operator) {
  return alwaysSupportedOperators.enumeration.includes(operator.constructor) || ifPrevSetSupportedOperators.enumeration.includes(operator.constructor) ? DefaultNullValueRecord({
    defaultValue: ''
  }) : undefined;
};

var getNumberDefaultNullValue = function getNumberDefaultNullValue(operator) {
  return alwaysSupportedOperators.number.includes(operator.constructor) || ifPrevSetSupportedOperators.number.includes(operator.constructor) ? DefaultNullValueRecord({
    defaultValue: 0
  }) : undefined;
};

var getStringDefaultNullValue = function getStringDefaultNullValue(operator) {
  return alwaysSupportedOperators.string.includes(operator.constructor) || ifPrevSetSupportedOperators.string.includes(operator.constructor) ? DefaultNullValueRecord({
    defaultValue: ''
  }) : undefined;
};

export var getDefaultNullValue = function getDefaultNullValue(operator) {
  var includeObjectsWithNoValueSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var defaultNullValue = undefined;

  switch (operator.field.type) {
    case PropertyTypes.BOOLEAN:
      defaultNullValue = getBooleanDefaultNullValue(operator);
      break;

    case PropertyTypes.DATE:
    case PropertyTypes.DATE_TIME:
      defaultNullValue = getDateDefaultNullValue(operator);
      break;

    case PropertyTypes.ENUMERATION:
      defaultNullValue = getEnumerationDefaultNullValue(operator);
      break;

    case PropertyTypes.NUMBER:
      defaultNullValue = getNumberDefaultNullValue(operator);
      break;

    case PropertyTypes.STRING:
      defaultNullValue = getStringDefaultNullValue(operator);
      break;

    default:
      return undefined;
  }

  return defaultNullValue ? defaultNullValue.set('includeObjectsWithNoValueSet', includeObjectsWithNoValueSet) : undefined;
};
export var operatorDefaultNullValueConditions = ImmutableMap(_defineProperty({}, PropertyTypes.NUMBER, ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, Operators.Equal, function (val) {
  return val === 0;
}), _defineProperty(_ImmutableMap, Operators.NotEqual, function () {
  return true;
}), _defineProperty(_ImmutableMap, Operators.Less, function (val) {
  return val > 0;
}), _defineProperty(_ImmutableMap, Operators.LessOrEqual, function (val) {
  return val >= 0;
}), _defineProperty(_ImmutableMap, Operators.Greater, function (val) {
  return val < 0;
}), _defineProperty(_ImmutableMap, Operators.GreaterOrEqual, function (val) {
  return val <= 0;
}), _ImmutableMap))));
export function isDefaultNullValueDefinedOnFilterValue(operator) {
  var defaultValue = operator.getIn(['defaultNullValue', 'defaultValue']);
  var defaultComparisonValue = operator.getIn(['defaultNullValue', 'defaultComparisonValue']); // default value of '' will never included objects for some properties, prevent "or is empty" from being shown
  // see: https://issues.hubspotcentral.com/browse/WORKFLOWS-5894

  if (operator.constructor === Operators.In) {
    var prop = operator.getIn(['field', 'name']);

    if (prop === 'pipeline' || prop === 'dealstage') {
      return false;
    }
  }

  return defaultValue !== null && defaultValue !== undefined || defaultComparisonValue !== null && defaultComparisonValue !== undefined;
}
export function isExplicitlyIncludeObjectsWithNoValueSet(operator) {
  var include = operator.getIn(['defaultNullValue', 'includeObjectsWithNoValueSet']);
  return include;
}
export function isOperatorIncludesObjectsWithNoValueSet(operator) {
  // do nothing until field is fetched
  if (MissingField.isMissingField(operator.field)) {
    return false;
  }

  if (isExplicitlyIncludeObjectsWithNoValueSet(operator)) {
    return true;
  }

  var propType = operator.field.type;
  var operatorName = operator.constructor.toString();
  var condition = operatorDefaultNullValueConditions.getIn([propType, operatorName]);

  if (condition) {
    return isDefaultNullValueDefinedOnFilterValue(operator) && condition(operator.value);
  }

  return isDefaultNullValueDefinedOnFilterValue(operator);
}
export function shouldOperatorAllwaysShowNoValueCheckbox(operator) {
  switch (operator.field.type) {
    case PropertyTypes.BOOLEAN:
      return alwaysSupportedOperators.boolean.includes(operator.constructor);

    case PropertyTypes.DATE:
    case PropertyTypes.DATE_TIME:
      return alwaysSupportedOperators.datetimePropComparison.includes(operator.constructor) || alwaysSupportedOperators.datetime.includes(operator.constructor);

    case PropertyTypes.ENUMERATION:
      return alwaysSupportedOperators.enumeration.includes(operator.constructor);

    case PropertyTypes.NUMBER:
      return alwaysSupportedOperators.number.includes(operator.constructor);

    case PropertyTypes.STRING:
      return alwaysSupportedOperators.string.includes(operator.constructor);

    default:
      return false;
  }
}