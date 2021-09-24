'use es6';

var LOCALE = 'en-us';
export default (function (createMoment) {
  return function () {
    return createMoment.apply(void 0, arguments).locale(LOCALE);
  };
});