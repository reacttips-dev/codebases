'use es6';

export default {
  create: function create() {
    var _data = null;
    var container = {
      set: function set(data) {
        _data = data;
        return _data;
      },
      get: function get() {
        return _data;
      }
    };
    return container;
  }
};