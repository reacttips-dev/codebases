'use es6';

export var validNumerical = function validNumerical(ids) {
  return ids.map(Number).filter(function (id) {
    return !isNaN(id);
  }).filter(function (id) {
    return id > 0;
  });
};