'use es6';

export var shouldOverrideTrigger = function shouldOverrideTrigger(startOpen) {
  if (startOpen === undefined || startOpen) {
    return false;
  }

  return true;
};