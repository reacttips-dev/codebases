'use es6';

var missingFunction = function missingFunction() {
  throw new Error('required function not defined');
};

export default missingFunction;