'use es6';

export var timestampIsToday = function timestampIsToday(timestamp) {
  var date = new Date(timestamp);
  var now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
};