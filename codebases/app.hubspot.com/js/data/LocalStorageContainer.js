'use es6';

var container = function container() {
  var local = localStorage;
  return {
    set: function set(key, value) {
      localStorage[key] = value;
      local = localStorage;
    },
    get: function get(key) {
      return local[key];
    }
  };
};

export default container();