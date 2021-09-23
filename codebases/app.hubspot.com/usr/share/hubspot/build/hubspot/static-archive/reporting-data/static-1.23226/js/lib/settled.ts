import { Promise } from './promise';

var status = function status(state) {
  return function (value) {
    return {
      state: state,
      value: value
    };
  };
};

export default (function (promises) {
  return Promise.all(promises.map(function (promise) {
    return promise.then(status('fulfilled')).catch(status('rejected'));
  }));
});