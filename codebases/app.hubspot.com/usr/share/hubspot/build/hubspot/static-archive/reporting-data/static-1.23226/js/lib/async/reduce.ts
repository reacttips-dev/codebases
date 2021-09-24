import { Promise } from '../promise';
export default (function (iterable, reducer, initial) {
  return iterable.reduce(function (promise) {
    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    return promise.then(function (resolved) {
      return Promise.resolve(reducer.apply(void 0, [resolved].concat(rest)));
    });
  }, Promise.resolve(initial));
});