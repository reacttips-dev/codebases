'use es6';

function allSettled(arrayOrPromise) {
  return Promise.resolve(arrayOrPromise).then(function (promises) {
    return Promise.all(promises.map(function (promise) {
      return Promise.resolve(promise).then(function (value) {
        return {
          status: 'fulfilled',
          value: value
        };
      }).catch(function (reason) {
        return {
          status: 'rejected',
          reason: reason
        };
      });
    }));
  });
}

export default allSettled;