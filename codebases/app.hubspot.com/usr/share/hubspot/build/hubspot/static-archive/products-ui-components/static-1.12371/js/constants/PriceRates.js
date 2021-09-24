'use es6';

export var MONTHLY = 'monthly';
export var QUARTERLY = 'quarterly';
export var PER_SIX_MONTHS = 'per_six_months';
export var ANNUALLY = 'annually';
export var PER_TWO_YEARS = 'per_two_years';
export var PER_THREE_YEARS = 'per_three_years';
export var PriceRateNames = [MONTHLY, QUARTERLY, PER_SIX_MONTHS, ANNUALLY, PER_TWO_YEARS, PER_THREE_YEARS];
export var PRICE_RATES = Object.freeze([{
  value: MONTHLY,
  months: 1
}, {
  value: QUARTERLY,
  months: 3
}, {
  value: PER_SIX_MONTHS,
  months: 6
}, {
  value: ANNUALLY,
  months: 12
}, {
  value: PER_TWO_YEARS,
  months: 24
}, {
  value: PER_THREE_YEARS,
  months: 36
}]);