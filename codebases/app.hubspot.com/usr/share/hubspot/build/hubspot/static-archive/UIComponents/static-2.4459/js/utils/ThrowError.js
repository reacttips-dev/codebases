'use es6';

export var throwErrorAsync = function throwErrorAsync(error) {
  setTimeout(function () {
    throw error;
  }, 0);
};