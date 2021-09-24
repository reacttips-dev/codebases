'use es6';

export var hasRequiredFeatures = function hasRequiredFeatures(window) {
  if (typeof window.requestAnimationFrame !== 'function') {
    return false;
  }

  if (typeof window.WeakMap !== 'function') {
    return false;
  }

  if (typeof window.Promise.all !== 'function') {
    return false;
  }

  if (typeof window.Promise.resolve !== 'function') {
    return false;
  }

  return true;
};