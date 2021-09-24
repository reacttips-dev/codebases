'use es6';

import defer from 'hs-promise-utils/defer';
export default {
  create: function create() {
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
        var _defer$promise;

        return (_defer$promise = _defer.promise).then.apply(_defer$promise, arguments);
      }
    };
  }
};