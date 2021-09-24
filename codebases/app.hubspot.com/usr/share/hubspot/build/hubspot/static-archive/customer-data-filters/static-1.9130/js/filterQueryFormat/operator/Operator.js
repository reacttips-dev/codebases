'use es6';

import * as DisplayTypes from '../DisplayTypes';
import * as InputTypes from '../InputTypes';
import { Iterable, Record } from 'immutable';
import DefaultNullValueRecord from '../DefaultNullValueRecord';
import devLogger from 'react-utils/devLogger';
import invariant from 'react-utils/invariant';
import isRecord from 'transmute/isRecord';
var OPERATOR_FLAG = '__OPERATOR_FLAG__';
export function isOperatorConstructor(operator) {
  return typeof operator === 'function' && operator[OPERATOR_FLAG] === true;
}
export function isOperator(operator) {
  return isOperatorConstructor(operator.constructor);
}
export function isValidOperator(operator) {
  var validOperator = Boolean(operator.field && operator.constructor.isValid(operator));
  var refinement = operator.refinement;
  var validRefinement = operator.constructor.isRefinable && refinement ? refinement.constructor.isValid(refinement) : true;
  return validOperator && validRefinement;
}

function defaultIsValid(value) {
  return value !== undefined;
}

function enforceValue(value, index) {
  invariant(typeof value.name === 'string' && value.name.length > 0, 'expected `value[%s].name` to be a non-empty string but got `%s`', index, value.name);
  invariant(value.isValid === undefined || typeof value.isValid === 'function', 'expected `value[%s].isValid` to be a function but got `%s`', index, value.isValid);
}
/*
type OperatorValue = {
  name: string,
  defaultValue: any,
  isValid: function,
}
*/


export function makeOperator(_ref) {
  var _ref$displayType = _ref.displayType,
      displayType = _ref$displayType === void 0 ? DisplayTypes.DefaultDisplayType : _ref$displayType,
      getLabel = _ref.getLabel,
      getOperatorDisplay = _ref.getOperatorDisplay,
      _ref$inputType = _ref.inputType,
      inputType = _ref$inputType === void 0 ? InputTypes.DefaultInputType : _ref$inputType,
      _ref$isRefinable = _ref.isRefinable,
      isRefinable = _ref$isRefinable === void 0 ? false : _ref$isRefinable,
      _ref$isRefinableExtra = _ref.isRefinableExtra,
      isRefinableExtra = _ref$isRefinableExtra === void 0 ? false : _ref$isRefinableExtra,
      name = _ref.name,
      _ref$values = _ref.values,
      values = _ref$values === void 0 ? [] : _ref$values;
  invariant(typeof name === 'string' && name.length > 1, 'expected `name` to be a non-empty string but got `%s`', name);
  values.forEach(enforceValue);
  var defaultProperties = {
    defaultNullValue: DefaultNullValueRecord(),
    field: undefined,
    name: name
  };

  if (isRefinable || isRefinableExtra) {
    defaultProperties.refinement = undefined;
  }

  var recordShape = values.reduce(function (acc, valueField) {
    acc[valueField.name] = valueField.defaultValue;
    return acc;
  }, defaultProperties);
  var defaultValidators = {
    field: defaultIsValid,
    refinement: function refinement(v) {
      return v === undefined || isOperator(v);
    }
  };
  var validators = values.reduce(function (acc, valueField) {
    acc[valueField.name] = valueField.isValid || defaultIsValid;
    return acc;
  }, defaultValidators);
  var Operator = Record(recordShape, name);

  var isInstance = function isInstance(value) {
    return value instanceof Operator;
  };

  Operator["is" + name] = isInstance;
  Operator[OPERATOR_FLAG] = true;
  Operator._name = name;

  Operator.toString = function () {
    return name;
  };

  if (Object.values(DisplayTypes).includes(displayType)) {
    Operator.displayType = displayType;
  } else {
    var errorMessage = "Attempted to create an operator with invalid display type: " + displayType;
    devLogger.warn({
      message: errorMessage
    });
  }

  if (Object.values(InputTypes).includes(inputType)) {
    Operator.inputType = inputType;
  } else {
    var _errorMessage = "Attempted to create an operator with invalid display type: " + inputType;

    devLogger.warn({
      message: _errorMessage
    });
  }

  Operator.getLabel = getLabel;
  Operator.getOperatorDisplay = getOperatorDisplay;

  Operator.of = function (field) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return Operator().withMutations(function (operator) {
      operator.set('field', field);
      values.forEach(function (valueField, index) {
        var value = args[index];

        if (validators[valueField.name](value, field)) {
          operator.set(valueField.name, value);
        }
      });
      return operator;
    });
  };

  Operator.ofUnsafe = function (field) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return Operator().withMutations(function (operator) {
      operator.set('field', field);
      values.forEach(function (valueField, index) {
        return operator.set(valueField.name, args[index]);
      });
      return operator;
    });
  };

  function isValidField(fieldName, value, field) {
    var validator = validators[fieldName];

    if (!validator) {
      return true;
    }

    return validators[fieldName](value, field);
  }

  Operator.isRefinable = isRefinable;
  Operator.isRefinableExtra = isRefinableExtra;

  Operator.isIterableField = function (fieldName) {
    var valueField = recordShape[fieldName];
    return Iterable.isIterable(valueField) && !isRecord(valueField);
  };

  Operator.isInexclusive = function (fieldName) {
    return Iterable.isIterable(recordShape[fieldName]) && recordShape.isInexclusive;
  };

  Operator.isValidField = isValidField;

  Operator.isValid = function (operator) {
    if (!isInstance(operator)) {
      return false;
    }

    if (!operator.field) {
      return false;
    }

    return values.every(function (_ref2) {
      var valueName = _ref2.name;
      return isValidField(valueName, operator.get(valueName), operator.field);
    });
  };

  return Operator;
}
export function swapOperator(Operator, currentInstance) {
  var initialInstance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return Operator().withMutations(function (operator) {
    return operator.forEach(function (defaultValue, key) {
      if (key === 'name') {
        return;
      }

      if (currentInstance.has(key)) {
        var value = currentInstance.get(key);

        if (Operator.isValidField(key, value, currentInstance.field)) {
          operator.set(key, value);
          return;
        }
      }

      if (initialInstance && initialInstance.has(key)) {
        var _value = initialInstance.get(key);

        if (Operator.isValidField(key, _value, currentInstance.field)) {
          operator.set(key, _value);
        }
      }
    });
  });
}