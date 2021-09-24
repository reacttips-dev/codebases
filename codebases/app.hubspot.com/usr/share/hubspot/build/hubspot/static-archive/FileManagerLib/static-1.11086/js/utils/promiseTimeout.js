'use es6';

export var promiseTimeout = function promiseTimeout(ms, promise) {
  // Create a promise that rejects in <ms> milliseconds
  var timeout = new Promise(function (resolve, reject) {
    var id = setTimeout(function () {
      clearTimeout(id);
      reject("Timed out in " + ms + " ms.");
    }, ms);
  }); // Returns a race between our timeout and the passed in promise

  return Promise.race([promise, timeout]);
};