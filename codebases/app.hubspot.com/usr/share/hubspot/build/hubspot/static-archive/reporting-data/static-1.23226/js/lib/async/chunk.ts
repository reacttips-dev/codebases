import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
var DEFAULT_SIZE = 100;

var count = function count(_ref) {
  var length = _ref.length,
      size = _ref.size;
  return size != null ? size : length;
};

var range = function range(size) {
  return _toConsumableArray(Array(size)).map(function (_, i) {
    return i;
  });
};

var chunk = function chunk(list, size) {
  return range(Math.ceil(count(list) / size)).map(function (index) {
    return list.slice(index * size, size * (index + 1));
  });
};

export default (function (callback, reducer, list) {
  var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_SIZE;
  return Promise.all(chunk(list, size).map(callback)).then(reducer);
});