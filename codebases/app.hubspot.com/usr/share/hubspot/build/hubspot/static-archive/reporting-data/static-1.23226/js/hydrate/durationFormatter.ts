import I18n from 'I18n';
var thresholds = {
  days: 2.4,
  hours: 2.4,
  minutes: 2.4,
  seconds: 0,
  milliseconds: 0
};

var getRoundedUnitWithPrecision = function getRoundedUnitWithPrecision(ms, unit) {
  var precisionModifier = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  return (// @ts-expect-error TS doesn't like math ops on Duration but it is legal
    Math.round(ms / unit * precisionModifier) / precisionModifier
  );
};

export var getUnits = function getUnits(precision) {
  var SECOND = I18n.moment.duration(1, 'second').valueOf();
  var MINUTE = I18n.moment.duration(1, 'minute').valueOf();
  var HOUR = I18n.moment.duration(1, 'hour').valueOf();
  var DAY = I18n.moment.duration(1, 'day').valueOf();
  var precisionModifier = precision ? Math.pow(10, precision) : 1;
  return {
    days: function days(ms) {
      return getRoundedUnitWithPrecision(ms, DAY, precisionModifier);
    },
    hours: function hours(ms) {
      return getRoundedUnitWithPrecision(ms, HOUR, precisionModifier);
    },
    minutes: function minutes(ms) {
      return getRoundedUnitWithPrecision(ms, MINUTE, precisionModifier);
    },
    seconds: function seconds(ms) {
      return getRoundedUnitWithPrecision(ms, SECOND);
    },
    milliseconds: function milliseconds(ms) {
      return (// @ts-expect-error TS doesn't like math ops on Duration but it is legal
        Math.round(ms)
      );
    }
  };
};
export var formatDuration = function formatDuration(ms, smallScale, precision) {
  return Object.keys(getUnits(precision)).reduce(function (label, unit) {
    var roundedValue = getUnits(precision)[unit](ms);
    return label || (Math.abs(roundedValue) > thresholds[unit] ? unit !== 'milliseconds' ? I18n.text("reporting-data.durations." + unit, {
      count: roundedValue
    }) : I18n.text("reporting-data.durations.seconds", {
      count: smallScale ? roundedValue / 1000 : I18n.SafeString("< " + (roundedValue > 0 ? '1' : '-1'))
    }) : 0);
  }, 0);
};