'use es6';

import I18n from 'I18n';
var UNITS_FOR_POWERS_OF_KILO = {
  GB: Math.pow(2, 30),
  MB: Math.pow(2, 20)
};
var megabitToBit = 0.000001;
export function fileSize(filesize) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  for (var unit in UNITS_FOR_POWERS_OF_KILO) {
    if (Object.prototype.hasOwnProperty.call(UNITS_FOR_POWERS_OF_KILO, unit)) {
      var minnum = UNITS_FOR_POWERS_OF_KILO[unit];

      if (filesize >= minnum) {
        return I18n.formatNumber(filesize / minnum, {
          precision: precision
        }) + " " + unit;
      }
    }
  }

  if (filesize >= 1024) {
    return I18n.formatNumber(filesize / 1024, {
      precision: 0
    }) + " KB";
  }

  return I18n.formatNumber(filesize) + " B";
}
export function megabitRate(bitrate) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var mbRate = bitrate * megabitToBit;
  return I18n.formatNumber(mbRate, {
    precision: precision
  }) + " Mb/s";
}