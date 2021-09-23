'use es6';

import I18n from 'I18n';
import once from 'transmute/once';

var text = function text(key, options) {
  return I18n.text("products.edit.term.units." + key, options);
};

export var MONTHS = 'months';
export var YEARS = 'years';
export var TermLengthUnitNames = [MONTHS, YEARS];
export var getTermLengthUnits = once(function () {
  return [{
    text: text('months'),
    value: MONTHS,
    months: 1
  }, {
    text: text('years'),
    value: YEARS,
    months: 12
  }];
});