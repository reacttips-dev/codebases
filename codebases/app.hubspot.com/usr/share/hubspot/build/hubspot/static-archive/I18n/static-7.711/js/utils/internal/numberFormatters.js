'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { prepareOptions, lookup } from './translateHelpers'; // Set default number format.

var NUMBER_FORMAT = {
  precision: 3,
  separator: '.',
  delimiter: ',',
  // HACK, HubSpot customizations to default number format
  // (more info at https://git.hubteam.com/HubSpot/I18n/commit/32fdaf1abad25b3b937a2947a83d788603636841 and https://git.hubteam.com/HubSpot/I18n/commit/7cff88e13955e56cf0f373480f3b04e7fc8b0512)
  // It would be much nicer if we could change these defaults without having to touch i18n.js (similar to existingOptions?)
  // , strip_insignificant_zeros: false
  strip_insignificant_zeros: true // END HACK

}; // Set default currency format.

var CURRENCY_FORMAT = {
  unit: '$',
  precision: 2,
  format: '%u%n',
  sign_first: true,
  delimiter: ',',
  separator: '.'
}; // Set default percentage format.

var PERCENTAGE_FORMAT = {
  unit: '%',
  precision: 3,
  format: '%n%u',
  separator: '.',
  delimiter: ''
};
var ABBREVIATE_DEFAULTS = {
  type: 'short',
  precision: 0
};
var arrJoin = Array.prototype.join; // A function to deal with the inaccuracy of calculating log10 in pre-ES6
// JavaScript environments. Math.log(num) / Math.LN10 was responsible for
// causing issue #62.

function log10Floor(n) {
  // ES6 provides the more accurate Math.log10
  if (typeof Math.log10 === 'function') {
    return Math.floor(Math.log10(n));
  }

  var x = Math.round(Math.log(n) * Math.LOG10E);
  return x - (Number('1e' + x) > n);
}

function toRawPrecision(x, minPrecision, maxPrecision) {
  var result,
      numDigits,
      isNegative = x < 0; // Deal with negative values later

  x = Math.abs(x); // If 0, pad out to maxPrecision 0 characters

  if (x === 0) {
    result = arrJoin.call(Array(maxPrecision + 1), '0');
    numDigits = 1;
  } else {
    // Positive values mean # of int digits and negative values mean # of fractional digits
    numDigits = log10Floor(Math.abs(x)) + 1; // Easier to get to result from here

    var factor = Math.round(Math.exp(Math.abs(numDigits - maxPrecision) * Math.LN10)); // b. Let result be the String consisting of the digits of the decimal
    //  representation of n (in order, with no leading zeroes)

    result = String(Math.round(numDigits - maxPrecision < 0 ? x * factor : x / factor));
  } // If numDigits ≥ maxPrecision, then pad the end of the number with zeros


  if (numDigits > maxPrecision) {
    result = result + arrJoin.call(Array(numDigits - maxPrecision + 1), '0');
    return isNegative ? '-' + result : result; // If numDigits = maxPrecision, then don't need to do anything
  } else if (numDigits === maxPrecision) {
    return isNegative ? '-' + result : result; // If numDigits > 0, then format as a decimal number with maxPrecision total digits
  } else if (numDigits > 0) {
    //var cutPoint = isNegative ? numDigits : numDigits + 1;
    result = result.slice(0, numDigits) + '.' + result.slice(numDigits); // If numDigits <= 0, then pad 0 zeros in front of decimal as needed
  } else if (numDigits <= 0) {
    result = '0.' + arrJoin.call(Array(-numDigits + 1), '0') + result;
  } // If result contains the character ".", and maxPrecision > minPrecision, then


  if (result.indexOf('.') >= 0 && maxPrecision > minPrecision) {
    var cut = maxPrecision - minPrecision; // Repeat while cut > 0 and the last character of result is "0":

    while (cut > 0 && result.charAt(result.length - 1) === '0') {
      result = result.slice(0, -1);
      cut--;
    } // If the last character of result is ".", then remove it


    if (result.charAt(result.length - 1) === '.') result = result.slice(0, -1);
  }

  return isNegative ? '-' + result : result;
}

function toRawFixed(x, minIntegerDigits, minFractionDigits, maxFractionDigits) {
  var idx;
  var padding;
  var result = Number.prototype.toFixed.call(x, maxFractionDigits);
  var intDigits = result.split('.')[0].length;
  var cut = maxFractionDigits - minFractionDigits; // eslint-disable-next-line no-cond-assign

  var exp = (idx = result.indexOf('e')) > -1 ? result.slice(idx + 1) : 0;

  if (exp) {
    result = result.slice(0, idx).replace('.', '');
    result += arrJoin.call(Array(exp - (result.length - 1) + 1), '0') + '.' + arrJoin.call(Array(maxFractionDigits + 1), '0');
    intDigits = result.length;
  } // Repeat while cut > 0 and the last character of result is "0":


  while (cut > 0 && result.slice(-1) === '0') {
    result = result.slice(0, -1);
    cut--;
  } // If the last character of result is ".", then remove it


  if (result.slice(-1) === '.') result = result.slice(0, -1); // If int < minIntegerDigits, then pad front with zeros

  if (intDigits < minIntegerDigits) {
    padding = arrJoin.call(Array(minIntegerDigits - intDigits + 1), '0');
  }

  return (padding || '') + result;
} // Format number using localization rules.
// The options will be retrieved from the `number.format` scope.
// If this isn't present, then the following options will be used:
//
// - `precision`: `3`
// - `separator`: `"."`
// - `delimiter`: `","`
// - `strip_insignificant_zeros`: `true`     // HACK, HubSpot customization to make this default to true instead of false (more info at https://git.hubteam.com/HubSpot/I18n/commit/32fdaf1abad25b3b937a2947a83d788603636841 and https://git.hubteam.com/HubSpot/I18n/commit/7cff88e13955e56cf0f373480f3b04e7fc8b0512)
//
// You can also override these options by providing the `options` argument.
//


export var toNumber = function toNumber(number, options) {
  options = prepareOptions(options, lookup('number.format'), NUMBER_FORMAT);
  var negative = number < 0;
  var string = Math.abs(number).toFixed(options.precision).toString();
  var parts = string.split('.');
  var buffer = [];
  var formattedNumber;
  var format = options.format || '%n';
  var sign = negative ? '−' : '';
  number = parts[0];
  var precision = parts[1];

  while (number.length > 0) {
    buffer.unshift(number.substr(Math.max(0, number.length - 3), 3));
    number = number.substr(0, number.length - 3);
  }

  formattedNumber = buffer.join(options.delimiter);

  if (options.strip_insignificant_zeros && precision) {
    precision = precision.replace(/0+$/, '');
  }

  if (options.precision > 0 && precision) {
    formattedNumber += options.separator + precision;
  }

  if (options.sign_first) {
    format = '%s' + format;
  } else {
    format = format.replace('%n', '%s%n');
  }

  formattedNumber = format.replace('%u', options.unit).replace('%n', formattedNumber).replace('%s', sign);
  return formattedNumber;
}; // Format currency with localization rules.
// The options will be retrieved from the `number.currency.format` and
// `number.format` scopes, in that order.
//
// Any missing option will be retrieved from the `I18n.toNumber` defaults and
// the following options:
//
// - `unit`: `"$"`
// - `precision`: `2`
// - `format`: `"%u%n"`
// - `delimiter`: `","`
// - `separator`: `"."`
//
// You can also override these options by providing the `options` argument.
//

export var toCurrency = function toCurrency(number, options) {
  var customLocale = (options || {}).locale;
  options = prepareOptions(options, lookup('number.currency.format', {
    locale: customLocale
  }), lookup('number.format', {
    locale: customLocale
  }), CURRENCY_FORMAT);
  return toNumber(number, options);
}; // Convert a number into a formatted percentage value.

export var toPercentage = function toPercentage(number, options) {
  options = prepareOptions(options, lookup('number.percentage.format'), lookup('number.format'), PERCENTAGE_FORMAT);
  return toNumber(number, options);
};
export var formatPercentage = function formatPercentage(val, opts) {
  if (opts == null) {
    opts = {};
  }

  return toPercentage(val, opts);
};
var NUMERAL_OR_SIGN_OR_E = /\d|\+|-|e/i;
export var parseNumber = function parseNumber(string, options) {
  options = prepareOptions(options, lookup('number.format', {
    locale: (options || {}).locale
  }), NUMBER_FORMAT);

  if (typeof string === 'number') {
    return string;
  } else if (typeof string !== 'string') {
    return NaN;
  } // Remove all whitespace and replace first instance of MINUS SIGN with HYPHEN MINUS


  string = string.replace(/\s/g, '').replace('−', '-'); // Iterate through all characters in the string and return NaN if we encounter an invalid character

  var buffer = '';

  for (var _i = 0, _Array$from = Array.from(string); _i < _Array$from.length; _i++) {
    var char = _Array$from[_i];

    if (char.match(NUMERAL_OR_SIGN_OR_E)) {
      buffer += char;
    } else if (char === options.separator) {
      buffer += '.';
    } else if (char === options.delimiter) {
      continue;
    } else {
      return NaN;
    }
  } // Attempt to parse what's left


  return parseFloat(buffer);
}; // Short number helpers (they use patterns set in `<locale>.human.abbreviated.(short|long)`)
//
// Standard options:
//   - **locale**: sets the locale to use for formatting (defaults to current `I18n.locale`)
//   - **separator**: overrides the separator—character between int and decimal digits—from the above locale
//   - **delimiter**: overrides the delimiter—character between every 3 int digits—from the above locale
// Advanced options (mostly borrowed from the Intl.NumberFormat spec):
//   - **minIntegerDigits**: the minimum number of integer digits—digits to the left of the decimal—to show (default is 1). Use this to left pad integers, like `00001`
//   - **minFractionDigits**: the minimum number of fractional digits—digits to the right of the decimal—to show (default is 0)
//   - **maxFractionDigits**: the maximum number of fractional digits—digits to the right of the decimal—to show (default is `max(minFractionDigits, 0)`)
//   - **minSignificantDigits**: the minimum number of any non-zersignficant digits to show (default is undefined or 1 if maxSignificantDigits is set)
//   - **maxSignificantDigits**: the maximum number of any signficant digits to show (default is undefined or <large number> if minSignificantDigits is set)
//   - **numDigitsToTruncateTo**: the desired number of integer digits. Cuts of the rest of the digits rounding up if needed (default is undefined)
//   - **stripInsignificantZeros**: remove all 0 decimal digits that at end (default is true unless any min/max fraction/significant digit option is set)

var ABBR_DIGIT_MAX = 15;
var ABBR_NUMBER_MAX = Math.pow(10, ABBR_DIGIT_MAX);
var ABBR_NUMBER_MIN = 1000;
export var advancedFormatNumber = function advancedFormatNumber(number, opts) {
  var formattedNumber;

  if (opts == null) {
    opts = {};
  }

  opts = prepareOptions(opts, lookup('number.format', {
    locale: opts.locale
  }), {
    separator: '.',
    delimiter: ','
  });
  var _opts = opts,
      separator = _opts.separator,
      delimiter = _opts.delimiter,
      numDigitsToTruncateTo = _opts.numDigitsToTruncateTo,
      maxThreshold = _opts.maxThreshold,
      minThreshold = _opts.minThreshold,
      minIntegerDigits = _opts.minIntegerDigits,
      maxSignificantDigits = _opts.maxSignificantDigits,
      minSignificantDigits = _opts.minSignificantDigits,
      maxFractionDigits = _opts.maxFractionDigits,
      minFractionDigits = _opts.minFractionDigits,
      stripInsignificantZeros = _opts.stripInsignificantZeros; // SET DEFAULTS

  var negative = number < 0; // Threshold for when a number should be truncated/abbreviated

  if (minThreshold == null) {
    minThreshold = Number.NEGATIVE_INFINITY;
  }

  if (maxThreshold == null) {
    maxThreshold = Number.POSITIVE_INFINITY;
  } // Default to not stripping zeros if any advanced formatting is passed


  if (minFractionDigits != null || minSignificantDigits != null || maxFractionDigits != null || maxSignificantDigits != null) {
    if (stripInsignificantZeros == null) {
      stripInsignificantZeros = false;
    }
  } else {
    if (stripInsignificantZeros == null) {
      stripInsignificantZeros = true;
    }
  } // Set higher than numDigits for zero-padded small numbers


  if (minIntegerDigits == null) {
    minIntegerDigits = Math.max(numDigitsToTruncateTo != null ? numDigitsToTruncateTo : 0, 1);
  } // Control the total number signficant digits (includes both fractional
  // and not fractional digits). No defaults unless one of the two is set


  if (minSignificantDigits != null || maxSignificantDigits != null) {
    if (maxSignificantDigits == null) {
      maxSignificantDigits = ABBR_DIGIT_MAX;
    }

    if (minSignificantDigits == null) {
      minSignificantDigits = 1;
    }
  } // Control the number of fractional digits


  if (minFractionDigits == null) {
    minFractionDigits = 0;
  }

  if (maxFractionDigits == null) {
    maxFractionDigits = Math.max(minFractionDigits, 0);
  } // CALCULATE FORMATTING


  var absNumber = Math.abs(number);

  if (numDigitsToTruncateTo != null && minThreshold <= absNumber && absNumber < maxThreshold) {
    var truncateFactor = Math.max(0, log10Floor(absNumber) + 1 - numDigitsToTruncateTo);
    absNumber = absNumber / Math.pow(10, truncateFactor);
  }

  if (minSignificantDigits != null && maxSignificantDigits != null) {
    formattedNumber = toRawPrecision(absNumber, minSignificantDigits, maxSignificantDigits);
  } else {
    formattedNumber = toRawFixed(absNumber, minIntegerDigits, minFractionDigits, maxFractionDigits);
  } // AND THEN LOCALIZE


  var parts = formattedNumber.split('.');
  var intPart = parts[0];
  var decPart = parts[1];
  var buffer = [];

  while (intPart.length > 0) {
    buffer.unshift(intPart.substr(Math.max(0, intPart.length - 3), 3));
    intPart = intPart.substr(0, intPart.length - 3);
  }

  var localizedNumber = buffer.join(delimiter);

  if (stripInsignificantZeros && decPart) {
    decPart = decPart.replace(/0+$/, '');
  }

  if (decPart) {
    localizedNumber += separator + decPart;
  }

  if (negative) {
    localizedNumber = "\u2212" + localizedNumber;
  }

  return localizedNumber;
};

var getAbbreviationKey = function getAbbreviationKey(number) {
  number = Math.abs(number);

  var zeroes = _toConsumableArray(Array(Math.floor(number).toString().length - 1).keys()).map(function () {
    return '0';
  }).join('');

  return "1" + zeroes;
};

var parseAbbreviatePattern = function parseAbbreviatePattern(pattern) {
  var match = pattern.match(/^([^0]*)(0+)(.*)$/);

  if (match) {
    var _match = _slicedToArray(match, 4),
        __ = _match[0],
        prefix = _match[1],
        digitString = _match[2],
        suffix = _match[3];

    var numDigits = digitString.length;
    return {
      prefix: prefix,
      digitString: digitString,
      numDigits: numDigits,
      suffix: suffix
    };
  } else {
    throw new Error("Invalid abbreviation pattern: " + pattern);
  }
};

export var abbreviateNumber = function abbreviateNumber(val, opts) {
  if (opts == null) {
    opts = {};
  }

  var _opts2 = opts,
      type = _opts2.type,
      locale = _opts2.locale,
      separator = _opts2.separator,
      delimiter = _opts2.delimiter,
      stripInsignificantZeros = _opts2.stripInsignificantZeros,
      minIntegerDigits = _opts2.minIntegerDigits,
      maxSignificantDigits = _opts2.maxSignificantDigits,
      minSignificantDigits = _opts2.minSignificantDigits,
      maxFractionDigits = _opts2.maxFractionDigits,
      minFractionDigits = _opts2.minFractionDigits;

  if (type == null) {
    type = 'short';
  } // or 'long'


  var key = getAbbreviationKey(val);
  var abbrPattern = lookup("number.human.abbreviated." + type + "." + key, opts); // Deal with pluralizing (just take the first plural pattern and use it to determine pluralization)

  if (abbrPattern != null && typeof abbrPattern === 'object') {
    var samplePatternString = abbrPattern[Object.keys(abbrPattern)[0]];
    var samplePattern = parseAbbreviatePattern(samplePatternString);
    var sampleTruncatedNumber = advancedFormatNumber(val, {
      numDigitsToTruncateTo: samplePattern.numDigits,
      minThreshold: ABBR_NUMBER_MIN,
      maxThreshold: ABBR_NUMBER_MAX
    });
    var pluralizer = I18n.pluralization.get(locale);
    var pluralKeys = pluralizer(Math.abs(sampleTruncatedNumber));

    while (pluralKeys.length) {
      var pluralKey = pluralKeys.shift();

      if (abbrPattern[pluralKey] != null) {
        abbrPattern = abbrPattern[pluralKey];
        break;
      }
    }
  } // If this locale is unable to truncate for this number size, set
  // numDigits to a high value to prevent any truncation from happening


  if (['0', 0].includes(abbrPattern) || abbrPattern == null) {
    return advancedFormatNumber(val, {
      locale: locale,
      numDigitsToTruncateTo: 30,
      minThreshold: ABBR_NUMBER_MIN,
      maxThreshold: ABBR_NUMBER_MAX,
      minIntegerDigits: minIntegerDigits != null ? minIntegerDigits : 1,
      // Need to set so it doesn't default to the large numDigitsToTruncateTo value
      minSignificantDigits: minSignificantDigits,
      maxSignificantDigits: maxSignificantDigits,
      minFractionDigits: minFractionDigits,
      maxFractionDigits: maxFractionDigits,
      separator: separator,
      delimiter: delimiter,
      stripInsignificantZeros: stripInsignificantZeros
    }); // Otherwise, truncate normally
  } else {
    var abbrFormat = parseAbbreviatePattern(abbrPattern);
    var formattedTruncatedNumber = advancedFormatNumber(val, {
      locale: locale,
      numDigitsToTruncateTo: abbrFormat.numDigits,
      minThreshold: ABBR_NUMBER_MIN,
      maxThreshold: ABBR_NUMBER_MAX,
      minIntegerDigits: minIntegerDigits,
      minSignificantDigits: minSignificantDigits,
      maxSignificantDigits: maxSignificantDigits,
      minFractionDigits: minFractionDigits,
      maxFractionDigits: maxFractionDigits,
      separator: separator,
      delimiter: delimiter,
      stripInsignificantZeros: stripInsignificantZeros
    });
    return "" + abbrFormat.prefix + formattedTruncatedNumber + abbrFormat.suffix;
  }
};
export var formatNumber = function formatNumber(val, opts) {
  if (opts == null) {
    opts = {};
  }

  if (opts.abbreviate) {
    opts = prepareOptions(opts, ABBREVIATE_DEFAULTS);

    if (typeof opts.abbreviate === 'string') {
      opts.type = opts.abbreviate;
    }

    return abbreviateNumber(val, opts);
  }

  return toNumber(val, opts);
};
export var formatCurrency = function formatCurrency(val, opts) {
  if (opts == null) {
    opts = {};
  }

  if (!I18n.currencySymbols['USD']) {
    console.error('It looks like currency data is not available. Are you using the new I18n loader and forgot to import currencies? See go/new-i18n');
  }

  if (opts.currencyCode) {
    var currencyData = I18n.currencySymbols[opts.currencyCode];

    if (currencyData) {
      if (opts.unit == null) {
        opts.unit = currencyData.symbol;
      }

      var decimalDigits = currencyData.decimal_digits;

      if (currencyData.alternative_decimal_digits && val % 1 !== 0) {
        decimalDigits = currencyData.alternative_decimal_digits;
      }

      if (opts.precision == null) {
        opts.precision = decimalDigits;
      }
    }
  }

  if (!opts.unit && !opts.useCurrencyCode) {
    console.warn('I18n: Missing or invalid currencyCode in call to formatCurrency. See https://git.hubteam.com/HubSpot/I18n/issues/59');
  }

  if (opts.abbreviate) {
    opts = prepareOptions(opts, ABBREVIATE_DEFAULTS);

    if (typeof opts.abbreviate === 'string') {
      opts.type = opts.abbreviate;
    } // Format an arbitrary number and replace it with the abbreviation, to preserve the sign/unit order


    var signedNumber = val >= 0 ? 2 : -2;
    return toCurrency(signedNumber, opts).replace('2', abbreviateNumber(Math.abs(val), opts));
  } else {
    return toCurrency(val, opts);
  }
};
export function initializeNumberMethods(I18n) {
  I18n.parseNumber = parseNumber;
  I18n.formatNumber = formatNumber;
  I18n.formatPercentage = formatPercentage;
  I18n.formatCurrency = formatCurrency;
  I18n.abbreviateNumber = abbreviateNumber;
  I18n.advancedFormatNumber = advancedFormatNumber;
}