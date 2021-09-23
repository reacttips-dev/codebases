'use es6';

import curry from 'transmute/curry';
var keyBy = curry(function (keyMapper, collection) {
  return collection.reduce(function (map, item) {
    map[keyMapper(item)] = item;
    return map;
  }, {});
});
export default keyBy;