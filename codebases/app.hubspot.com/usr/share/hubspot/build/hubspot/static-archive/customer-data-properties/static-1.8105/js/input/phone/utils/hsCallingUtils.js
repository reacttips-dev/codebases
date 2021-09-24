// Notice: This file is a duplicate that can be found in calling-library.
// TODO: Discuss with team how we might prioritize reducing duplicate code
// and moving it into a sharable library.
'use es6';

export var callingAPIMethodWithQueue = function callingAPIMethodWithQueue(method, options) {
  return new Promise(function (resolve) {
    if (!window.hsCalling || !window.hsCalling.isReady) {
      window.hsCallingOnReady = window.hsCallingOnReady || [];
      window.hsCallingOnReady.push(function () {
        resolve(window.hsCalling[method](options));
      });
    } else {
      resolve(window.hsCalling[method](options));
    }
  });
};