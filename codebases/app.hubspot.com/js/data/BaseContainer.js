'use es6';

import defer from 'hs-promise-utils/defer';
export function create() {
  var _defer = defer();

  var _data = null;
  return {
    set: function set(data) {
      _defer.resolve(data);

      _data = data;
    },
    get: function get() {
      return _data;
    },
    then: function then() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _defer.promise.then.apply(null, args);
    }
  };
}