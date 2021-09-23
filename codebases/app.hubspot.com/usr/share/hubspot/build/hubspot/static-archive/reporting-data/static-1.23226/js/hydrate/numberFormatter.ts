import I18n from 'I18n';
import { DEFAULT_NULL_VALUES } from '../constants/defaultNullValues';
import { formatDuration } from './durationFormatter';
var FALLBACK = '–';

var withFallback = function withFallback(format) {
  var coerce = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Number;
  return function (value) {
    var coercedValue = coerce(typeof value === 'string' ? value.replace(/,/g, '') : value);

    if ([null, undefined, ''].includes(value) || // TODO remove following line - Typescript is erroring because the types
    // make the call impossible
    // @ts-expect-error legacy redundant call
    [null, undefined].includes(coercedValue) || !isFinite(coercedValue)) {
      return FALLBACK;
    }

    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    return format.apply(void 0, [coercedValue].concat(rest));
  };
};

var getPrecision = function getPrecision(value) {
  return Number(value) % 1 === 0 ? 0 : 2;
};

export var number = withFallback(function (value) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return (// @ts-expect-error Untyped dependency
    I18n.formatNumber(value, Object.assign({
      precision: getPrecision(value)
    }, options))
  );
});
export var percent = withFallback(function (value) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return (// @ts-expect-error Untyped dependency
    I18n.formatPercentage(value, Object.assign({
      precision: getPrecision(value)
    }, options))
  );
});
export var currency = withFallback(function (value) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var currencyCode = options.currencyCode;
  return currencyCode && currencyCode !== DEFAULT_NULL_VALUES.CURRENCY ? //@ts-expect-error Untyped dependency
  I18n.formatCurrency(value, Object.assign({}, options)) : number(value, options);
});
export var duration = withFallback(function (value) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$durationUnit = _ref.durationUnit,
      durationUnit = _ref$durationUnit === void 0 ? 'milliseconds' : _ref$durationUnit,
      _ref$smallScale = _ref.smallScale,
      smallScale = _ref$smallScale === void 0 ? false : _ref$smallScale,
      _ref$durationPrecisio = _ref.durationPrecision,
      durationPrecision = _ref$durationPrecisio === void 0 ? 1 : _ref$durationPrecisio;

  return formatDuration(I18n.moment.duration(value, durationUnit), smallScale, durationPrecision);
});