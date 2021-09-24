'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import I18n from 'I18n';
import NonDecimalRegex from 'PatternValidationJS/regex/NonDecimalRegex';
import * as PropertyIdentifier from 'customer-data-objects/property/PropertyIdentifier';
import { DATE_TIME } from 'customer-data-objects/property/PropertyTypes';
import { propertyLabelTranslatorWithIsHubSpotDefined } from 'property-translator/propertyTranslator';
import TimezoneTypes from 'I18n/constants/TimezoneTypes';
import { parseMultiEnumValue } from './parseMultiEnumValue';
import { EMPTY_PROPERTY_VALUE } from './constants/EmptyPropertyValue';

var toOptions = function toOptions(property) {
  var translatedPropertyOptions = property.options.map(function (option) {
    return {
      text: propertyLabelTranslatorWithIsHubSpotDefined({
        label: option.label,
        isHubSpotDefined: property.hubspotDefined
      }),
      value: option.value
    };
  });
  return Array.isArray(translatedPropertyOptions) ? translatedPropertyOptions : translatedPropertyOptions.toJS();
};

export function sanitizeValue(property, value) {
  if (typeof value === 'string') {
    if (PropertyIdentifier.isEnum(property)) {
      value = ("" + value).replace(/\r\n/g, '\n').trim();
    }

    if (PropertyIdentifier.isCurrency(property) || PropertyIdentifier.isNumber(property)) {
      value = value.replace(NonDecimalRegex, '').trim();
    }
  }

  return value;
} //if the dropdown is allowed to be cleared, use makeOptionsFromProperty

export function makeOptionsFromPropertyWithoutBlankOptions(property) {
  return toOptions(property);
}
export function makeOptionsFromProperty(property) {
  var options = [];
  var placeholder = propertyLabelTranslatorWithIsHubSpotDefined({
    label: property.placeholder,
    isHubSpotDefined: property.hubspotDefined
  });
  var optionsArrFromProperties = toOptions(property);
  var hasBlankOption = property.options.some(function (option) {
    return option.value === '';
  });

  if (!hasBlankOption) {
    var placeholderOption = {
      text: placeholder,
      value: ''
    };
    options = [placeholderOption].concat(_toConsumableArray(optionsArrFromProperties));
  } else {
    options = optionsArrFromProperties;
  }

  return options;
}
export function getDisplayedValue(property, value, choices) {
  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$dateFormat = _ref.dateFormat,
      dateFormat = _ref$dateFormat === void 0 ? 'L' : _ref$dateFormat,
      _ref$dateTimeFormat = _ref.dateTimeFormat,
      dateTimeFormat = _ref$dateTimeFormat === void 0 ? 'L LT z' : _ref$dateTimeFormat;

  var displayValue;

  if (value == null) {
    value = '';
  }

  var propIsMultienum = PropertyIdentifier.isMultienum(property);

  if (PropertyIdentifier.isEnum(property) || propIsMultienum) {
    var selectedItems;

    if (propIsMultienum) {
      selectedItems = parseMultiEnumValue(value);
    }

    if (choices == null) {
      choices = makeOptionsFromProperty(property);
    }

    var selected = choices.filter(function (choice) {
      var choiceValue = choice.id || choice.value;

      if (propIsMultienum) {
        return Array.from(selectedItems).includes(choiceValue);
      }

      return choiceValue === value;
    }).map(function (obj) {
      return obj.text;
    });
    displayValue = selected.join(', ');
  } else if (PropertyIdentifier.isDate(property) && value !== '' && value != null) {
    if (property.type === DATE_TIME) {
      displayValue = I18n.moment.userTz(Number(value)).format(dateTimeFormat);
    } else {
      // property.type === DATE
      displayValue = I18n.moment.utc(Number(value)).format(dateFormat);
    }
  } else if (PropertyIdentifier.isPercent(property)) {
    displayValue = I18n.formatPercentage(value * 100, {
      precision: 2
    });
  } else if (PropertyIdentifier.isPercentWholeNumber(property)) {
    displayValue = I18n.formatPercentage(value, {
      precision: 2
    });
  } else if (PropertyIdentifier.isDuration(property) || PropertyIdentifier.isDurationEquation(property)) {
    // See `PropertyInputReadOnlyDuration`
    if (value === null || value === undefined || isNaN(value) || value === '') {
      displayValue = EMPTY_PROPERTY_VALUE;
    } else {
      var from = I18n.moment().valueOf() - value;
      var type = TimezoneTypes.PORTAL;
      var fromValue = I18n.moment[type](from);
      displayValue = fromValue.toNow(true);
    }
  } else if (PropertyIdentifier.isFormattedNumber(property)) {
    // See `PropertyInputNumber`
    displayValue = value === '' ? '' : I18n.formatNumber(value, {
      precision: 5
    });
  }

  return displayValue || value;
}