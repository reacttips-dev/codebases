'use es6';

export function getValueOption(options, value) {
  // Return the option with the given value
  if (!options) {
    return null;
  }

  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    var isGroup = Array.isArray(option.options);

    if (isGroup) {
      var match = getValueOption(option.options, value);

      if (match) {
        return match;
      }
    } else if (option.value === value) {
      return option;
    }
  } // No match


  return null;
}
export function getButtonProps(_ref) {
  var async = _ref.async,
      options = _ref.options,
      placeholder = _ref.placeholder,
      resetOption = _ref.resetOption,
      resetValue = _ref.resetValue,
      value = _ref.value,
      valueRenderer = _ref.valueRenderer;

  // Return the appropriate button text corresponding to the given value
  var renderOption = function renderOption(option) {
    return valueRenderer ? valueRenderer(option) : option.text || option.buttonText;
  }; // If the "value" is an option object, use it.


  if (value !== null && typeof value === 'object') {
    return {
      buttonText: renderOption(value),
      valueIsValid: true
    };
  } // If the value is the resetValue, show the placeholder.


  if (value === resetValue) {
    if (resetOption) {
      return {
        buttonText: renderOption(resetOption),
        valueIsValid: true
      };
    }

    return {
      buttonText: placeholder,
      valueIsValid: true
    };
  } // If an option matches the value, use it.


  if (options) {
    var valueOption = getValueOption(options, value);

    if (valueOption) {
      return {
        buttonText: renderOption(valueOption),
        valueIsValid: true
      };
    }
  } // Otherwise, render the value itself.


  return {
    buttonText: renderOption({
      text: value,
      value: value
    }),
    valueIsValid: !!async
  };
}