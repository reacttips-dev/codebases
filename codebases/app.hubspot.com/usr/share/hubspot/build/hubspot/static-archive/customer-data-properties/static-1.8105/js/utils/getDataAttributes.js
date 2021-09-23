'use es6';

export var getDataAttributes = function getDataAttributes(props) {
  var results = {};
  Object.keys(props).forEach(function (key) {
    return key.indexOf('data') === 0 ? results[key] = props[key] : undefined;
  });
  return results;
};