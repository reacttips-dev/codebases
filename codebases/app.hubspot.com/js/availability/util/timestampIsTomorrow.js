'use es6';

export var timestampIsTomorrow = function timestampIsTomorrow(timestamp) {
  var date = new Date(timestamp);
  var now = new Date();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1).valueOf() === new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
};