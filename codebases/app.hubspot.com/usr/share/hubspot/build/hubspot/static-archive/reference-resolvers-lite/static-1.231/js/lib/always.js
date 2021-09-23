'use es6';

var always = function always(v) {
  return function () {
    return v;
  };
};

export default always;