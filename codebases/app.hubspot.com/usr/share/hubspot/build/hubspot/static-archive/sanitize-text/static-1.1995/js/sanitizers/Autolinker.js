'use es6';

import Autolinker from 'autolinker';

var once = function once(func) {
  var alreadyCalled = false;
  var result;
  return function () {
    if (!alreadyCalled) {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      result = func.apply(this, args);
      alreadyCalled = true;
    }

    return result;
  };
};

export default {
  get: once(function () {
    return new Autolinker({
      stripPrefix: false
    });
  }),
  getTwitter: once(function () {
    return new Autolinker({
      hashtag: 'twitter',
      mention: 'twitter',
      stripPrefix: false
    });
  })
};