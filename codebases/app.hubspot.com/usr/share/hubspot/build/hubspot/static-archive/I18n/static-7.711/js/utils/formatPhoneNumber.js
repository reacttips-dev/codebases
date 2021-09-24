'use es6';

import guessCountryFromDialCode from './guessCountryFromDialCode';
export default (function (value) {
  var numberFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var numberText = value;
  var pattern = numberFormat;

  if (!pattern) {
    numberText = value.replace(/\D/g, '');
    var country = value[0] === '+' && guessCountryFromDialCode(numberText);
    pattern = country && country.format;
  }

  if (!pattern) {
    return value;
  } // for all strings with length less than 3, just return it


  if (numberText && numberText.length < 2 || !pattern) {
    return "+" + numberText.replace(/\D/g, '');
  }

  var formattedObject = pattern.split('').reduce(function (acc, character) {
    if (acc.remainingText.length === 0) {
      return acc;
    }

    if (character !== '.') {
      return {
        formattedText: acc.formattedText + character,
        remainingText: acc.remainingText
      };
    }

    return {
      formattedText: acc.formattedText + acc.remainingText[0],
      remainingText: acc.remainingText.slice(1)
    };
  }, {
    formattedText: '',
    remainingText: numberText
  });
  return formattedObject.formattedText + formattedObject.remainingText;
});