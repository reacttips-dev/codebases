'use es6';

var indexBy = function indexBy(keyMapper) {
  return function (subject) {
    return subject.reduce(function (acc, v) {
      acc[keyMapper(v)] = v;
      return acc;
    }, {});
  };
};

export default indexBy;