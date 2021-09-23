'use es6';

var currentId = 0;

var uniqueId = function uniqueId(namespace) {
  currentId++;
  return "" + namespace + currentId;
};

export default function (actionTypeMap) {
  var uniques = {};
  Object.keys(actionTypeMap).forEach(function (key) {
    uniques[key] = uniqueId(actionTypeMap[key] || key);
  });
  return uniques;
}