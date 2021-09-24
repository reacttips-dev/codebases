'use es6';

import UISelect from 'UIComponents/input/UISelect';

var trim = function trim(str) {
  return str.replace(/^\s+|\s+$/g, '');
};

var stripDiacritics = UISelect.stripDiacritics;

var isValid = function isValid(value) {
  return typeof value !== 'undefined' && value !== null && value !== '';
};

var defaultFilterOptions = function defaultFilterOptions(options, filterValue, excludeOptions, props) {
  if (props.ignoreAccents) {
    filterValue = stripDiacritics(filterValue);
  }

  if (props.ignoreCase) {
    filterValue = filterValue.toLowerCase();
  }

  if (props.trimFilter) {
    filterValue = trim(filterValue);
  }

  if (excludeOptions) excludeOptions = excludeOptions.map(function (i) {
    return i[props.valueKey];
  });
  return options.filter(function (option) {
    if (excludeOptions && excludeOptions.indexOf(option[props.valueKey]) > -1) return false;
    if (props.filterOption) return props.filterOption.call(undefined, option, filterValue);
    if (!filterValue) return true;
    var value = option[props.valueKey];
    var label = option[props.labelKey];
    var help = option.help;
    var hasValue = isValid(value);
    var hasLabel = isValid(label);
    var hasHelp = isValid(help);

    if (!hasValue && !hasLabel) {
      return false;
    }

    var valueTest = hasValue ? String(value) : null;
    var labelTest = hasLabel ? String(label) : null;
    var helpTest = hasHelp ? String(help) : null;

    if (props.ignoreAccents) {
      valueTest = hasValue && stripDiacritics(valueTest);
      labelTest = hasLabel && stripDiacritics(labelTest);
      helpTest = hasHelp && stripDiacritics(helpTest);
    }

    if (props.ignoreCase) {
      valueTest = hasValue && valueTest.toLowerCase();
      labelTest = hasLabel && labelTest.toLowerCase();
      helpTest = hasHelp && helpTest.toLowerCase();
    }

    return props.matchPos === 'start' ? valueTest && valueTest.substr(0, filterValue.length) === filterValue || labelTest && labelTest.substr(0, filterValue.length) === filterValue || helpTest && helpTest.substr(0, filterValue.length) === filterValue : valueTest && valueTest.indexOf(filterValue) >= 0 || labelTest && labelTest.indexOf(filterValue) >= 0 || helpTest && helpTest.indexOf(filterValue) >= 0;
  });
};

export default defaultFilterOptions;