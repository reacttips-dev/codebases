'use es6';

function isThenable(obj) {
  return !!(obj && typeof obj.then === 'function');
}

export default isThenable;