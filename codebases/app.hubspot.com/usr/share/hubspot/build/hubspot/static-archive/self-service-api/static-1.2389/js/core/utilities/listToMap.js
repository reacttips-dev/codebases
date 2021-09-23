'use es6';

export var listToMap = function listToMap(list, key) {
  var result = {};
  list.forEach(function (value) {
    result[value[key]] = value;
  });
  return result;
};