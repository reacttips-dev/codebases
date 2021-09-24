'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _operatorNameToOption, _optionValueToOperato;

import * as OperatorTypes from 'customer-data-filters/converters/contactSearch/FilterContactSearchOperatorTypes';
import I18n from 'I18n';
import { InRange, Equal, Greater, GreaterOrEqual, Less, LessOrEqual, NotEqual } from 'customer-data-filters/filterQueryFormat/operator/Operators';
import once from 'transmute/once';
export var getDurationOptions = once(function () {
  return [I18n.text('time.minutes'), I18n.text('time.hours'), I18n.text('indexPage.quickFilters.duration.time.seconds')].map(function (v) {
    return {
      text: v.toLowerCase(),
      value: v.toLowerCase()
    };
  });
});
export var defaultGetDisplayTextFn = function defaultGetDisplayTextFn(symbol, filter) {
  return symbol + " " + filter.get('value');
};
export var twoValueGetDisplayTextFn = function twoValueGetDisplayTextFn(symbol, filter) {
  var value1 = filter.get('value');
  var value2 = filter.get('highValue');
  return value2 > value1 ? value1 + " " + symbol + " " + value2 : value2 + " " + symbol + " " + value1;
};
export var betweenOption = {
  getDisplayText: twoValueGetDisplayTextFn,
  langToken: 'indexPage.quickFilters.number.operatorHelp.between',
  symbol: '―',
  value: OperatorTypes.IN_RANGE
};
export var equalOption = {
  getDisplayText: defaultGetDisplayTextFn,
  langToken: 'indexPage.quickFilters.number.operatorHelp.equal',
  symbol: '=',
  value: OperatorTypes.EQUAL
};
export var notEqualOption = {
  getDisplayText: defaultGetDisplayTextFn,
  langToken: 'indexPage.quickFilters.number.operatorHelp.notEqual',
  symbol: '≠',
  value: OperatorTypes.NOT_EQUAL
};
export var lessOption = {
  getDisplayText: defaultGetDisplayTextFn,
  langToken: 'indexPage.quickFilters.number.operatorHelp.less',
  symbol: '<',
  value: OperatorTypes.LESS
};
export var lessOrEqualOption = {
  getDisplayText: defaultGetDisplayTextFn,
  langToken: 'indexPage.quickFilters.number.operatorHelp.lessOrEqual',
  symbol: '≤',
  value: OperatorTypes.LESS_OR_EQUAL
};
export var greaterOption = {
  getDisplayText: defaultGetDisplayTextFn,
  langToken: 'indexPage.quickFilters.number.operatorHelp.greater',
  symbol: '>',
  value: OperatorTypes.GREATER
};
export var greaterOrEqualOption = {
  getDisplayText: defaultGetDisplayTextFn,
  langToken: 'indexPage.quickFilters.number.operatorHelp.greaterOrEqual',
  symbol: '≥',
  value: OperatorTypes.GREATER_OR_EQUAL
}; // Used when interpreting existing filters

export var operatorNameToOption = (_operatorNameToOption = {}, _defineProperty(_operatorNameToOption, OperatorTypes.IN_RANGE, betweenOption), _defineProperty(_operatorNameToOption, OperatorTypes.EQUAL, equalOption), _defineProperty(_operatorNameToOption, OperatorTypes.NOT_EQUAL, notEqualOption), _defineProperty(_operatorNameToOption, OperatorTypes.LESS, lessOption), _defineProperty(_operatorNameToOption, OperatorTypes.LESS_OR_EQUAL, lessOrEqualOption), _defineProperty(_operatorNameToOption, OperatorTypes.GREATER, greaterOption), _defineProperty(_operatorNameToOption, OperatorTypes.GREATER_OR_EQUAL, greaterOrEqualOption), _operatorNameToOption);
export var checkIfOperatorSupported = function checkIfOperatorSupported(operatorType) {
  return Object.prototype.hasOwnProperty.call(operatorNameToOption, operatorType);
}; // Display order of the options

export var orderedOptions = [betweenOption, equalOption, notEqualOption, lessOption, lessOrEqualOption, greaterOption, greaterOrEqualOption];
export var operatorsThatUseLeftInput = [betweenOption.value];
export var optionUsesLeftInput = function optionUsesLeftInput(optionValue) {
  return operatorsThatUseLeftInput.indexOf(optionValue) > -1;
};
export var optionValueToOperator = (_optionValueToOperato = {}, _defineProperty(_optionValueToOperato, betweenOption.value, InRange), _defineProperty(_optionValueToOperato, equalOption.value, Equal), _defineProperty(_optionValueToOperato, greaterOption.value, Greater), _defineProperty(_optionValueToOperato, greaterOrEqualOption.value, GreaterOrEqual), _defineProperty(_optionValueToOperato, lessOption.value, Less), _defineProperty(_optionValueToOperato, lessOrEqualOption.value, LessOrEqual), _defineProperty(_optionValueToOperato, notEqualOption.value, NotEqual), _optionValueToOperato);
export var initialState = {
  isOpen: false,
  durationValue: getDurationOptions()[0].text,
  leftInputEnabled: optionUsesLeftInput(orderedOptions[0].value),
  leftValue: 0,
  operatorValue: betweenOption.value,
  rightValue: 0
};
export var actions = {
  reset: 'reset',
  leftValueChanged: 'leftValueChanged',
  rightValueChanged: 'rightValueChanged',
  operatorChanged: 'operatorChanged',
  openedStateChanged: 'openedStateChanged',
  filterUpdated: 'filterUpdated',
  durationValueChanged: 'durationValueChanged'
};
export var mapFilterToState = function mapFilterToState(filter) {
  if (!filter) {
    return {};
  }

  var value = filter.get('value');
  var highValue = filter.get('highValue');
  var operatorOption = operatorNameToOption[filter.get('operator')];
  var useLeftInput = optionUsesLeftInput(operatorOption.value);
  var state = {
    operatorValue: operatorOption.value,
    leftInputEnabled: useLeftInput,
    rightValue: value
  };

  if (useLeftInput) {
    state.leftValue = Math.min(value, highValue);
    state.rightValue = Math.max(value, highValue);
  }

  return state;
};
export var reducer = function reducer(state, action) {
  switch (action.type) {
    case actions.filterUpdated:
      return Object.assign({}, state, {}, mapFilterToState(action.payload));

    case actions.reset:
      return initialState;

    case actions.durationValueChanged:
      return Object.assign({}, state, {
        durationValue: action.payload
      });

    case actions.leftValueChanged:
      return Object.assign({}, state, {
        leftValue: action.payload
      });

    case actions.rightValueChanged:
      return Object.assign({}, state, {
        rightValue: action.payload
      });

    case actions.operatorChanged:
      return Object.assign({}, state, {
        operatorValue: action.payload,
        leftValue: optionUsesLeftInput(action.payload) ? state.leftValue : initialState.leftValue,
        leftInputEnabled: optionUsesLeftInput(action.payload)
      });

    case actions.openedStateChanged:
      return Object.assign({}, state, {
        isOpen: !state.isOpen
      });

    default:
      return state;
  }
};