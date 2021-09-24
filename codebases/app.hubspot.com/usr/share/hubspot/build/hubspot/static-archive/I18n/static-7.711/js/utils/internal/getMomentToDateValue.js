'use es6';

export default (function (value, type) {
  var momentValue = I18n.moment[type || 'userTz'](value);
  return new Date(momentValue.year(), momentValue.month(), momentValue.date(), momentValue.hours(), momentValue.minutes(), momentValue.seconds(), momentValue.milliseconds());
});