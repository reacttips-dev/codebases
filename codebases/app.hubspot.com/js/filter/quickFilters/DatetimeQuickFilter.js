'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import * as FiscalYearRollingDateOptionsValues from 'customer-data-filters/filterQueryFormat/rollingDates/FiscalYearRollingDateOptionsValues';
import * as RollingDateOptions from 'customer-data-filters/filterQueryFormat/rollingDates/RollingDateOptions';
import { IN_RANGE_ROLLING, TIME_UNIT_TO_DATE } from 'customer-data-filters/converters/contactSearch/FilterContactSearchOperatorTypes';
import { BACKWARD, FORWARD } from 'customer-data-filters/filterQueryFormat/rollingDates/RollingDateDirections';
import RollingDateConfig from 'customer-data-filters/filterQueryFormat/rollingDates/RollingDateConfig';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import { Seq, Map as ImmutableMap } from 'immutable';
import I18n from 'I18n';
import InRollingDateRange from 'customer-data-filters/filterQueryFormat/operator/InRollingDateRange';
import memoize from 'transmute/memoize';
import PropertyType from 'customer-data-objects-ui-components/propTypes/PropertyType';
import PropTypes from 'prop-types';
import UISelect from 'UIComponents/input/UISelect';
import UITruncateString from 'UIComponents/text/UITruncateString';
import get from 'transmute/get';
import { useHasAllGates } from '../../rewrite/auth/hooks/useHasAllGates';

var checkIfOperatorSupported = function checkIfOperatorSupported(operatorType, rollingOffset) {
  if (rollingOffset) {
    return false;
  }

  return operatorType === IN_RANGE_ROLLING || operatorType === TIME_UNIT_TO_DATE;
};

var DatetimeCustomValueComponent = function DatetimeCustomValueComponent(props) {
  return /*#__PURE__*/_jsx(UITruncateString, {
    maxWidth: 120,
    children: props.children
  });
};

export var createRollingDateOptions = memoize(function (isFiscalYearEnabled) {
  return Seq(RollingDateOptions).filter(function (option) {
    return isFiscalYearEnabled || !FiscalYearRollingDateOptionsValues[option.value];
  }).map(function (option) {
    return {
      help: I18n.text(option.helpToken),
      text: I18n.text(option.textToken),
      value: option.value
    };
  }).toArray();
});
var defaultFilter = ImmutableMap();

var DatetimeQuickFilter = function DatetimeQuickFilter(_ref) {
  var _ref$filter = _ref.filter,
      filter = _ref$filter === void 0 ? defaultFilter : _ref$filter,
      onValueChange = _ref.onValueChange,
      property = _ref.property;
  var hasAllGates = useHasAllGates();
  var isUngatedForFiscalYear = hasAllGates('settings:accountdefaults:fiscalyear');
  var options = createRollingDateOptions(isUngatedForFiscalYear);
  var inclusive = get('inclusive', filter);
  var operator = get('operator', filter);
  var rollForward = get('rollForward', filter) || false;
  var rollingOffset = get('rollingOffset', filter);
  var timeUnit = get('timeUnit', filter);
  var timeUnitCount = get('timeUnitCount', filter);
  var direction = rollForward === true ? FORWARD : BACKWARD;
  var includeFutureDates = operator === IN_RANGE_ROLLING;
  var rollingDateConfig = RollingDateConfig({
    direction: direction,
    includeFutureDates: includeFutureDates,
    isInclusive: Boolean(inclusive),
    timeUnit: timeUnit,
    value: timeUnitCount
  }); // If the operator type is not supported in the quick filter then we don't
  // want to use the quick filter, it will show up in the advanced panel

  var value = checkIfOperatorSupported(operator, rollingOffset) ? RollingDateConfig.toRollingDateOptionValue(rollingDateConfig) : undefined;

  var onDateValueChange = function onDateValueChange(_ref2) {
    var optionValue = _ref2.target.value;
    var newRollingDateConfig = RollingDateConfig.fromRollingDateOptionValue(optionValue);
    var filterQueryFormat = newRollingDateConfig ? InRollingDateRange.of(property, newRollingDateConfig) : null;
    onValueChange(property.name, filterQueryFormat);
  };

  var renderButtonContent = function renderButtonContent() {
    var label = property.hubspotDefined ? propertyLabelTranslator(property.label) : property.label;
    return /*#__PURE__*/_jsx(UITruncateString, {
      maxWidth: 120,
      children: label
    });
  };

  return /*#__PURE__*/_jsx("label", {
    children: /*#__PURE__*/_jsx(UISelect, {
      menuWidth: "auto",
      ButtonContent: renderButtonContent,
      valueComponent: DatetimeCustomValueComponent,
      "data-selenium-test": "quickfilters-" + property.name,
      buttonUse: "transparent",
      onChange: onDateValueChange,
      options: options,
      placeholder: property.hubspotDefined ? propertyLabelTranslator(property.label) : property.label,
      value: value
    })
  });
};

DatetimeQuickFilter.proptypes = {
  filter: PropTypes.instanceOf(ImmutableMap),
  onValueChange: PropTypes.func.isRequired,
  property: PropertyType.isRequired
};
export default DatetimeQuickFilter;