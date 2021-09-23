'use es6';

var get = function get(key) {
  return function (obj) {
    return obj[key];
  };
};

export default get;