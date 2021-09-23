'use es6';

export var parseStringBoolean = function parseStringBoolean(stringBoolean) {
  if (stringBoolean === 'true') {
    return true;
  }

  if (stringBoolean === 'false') {
    return false;
  }

  return undefined;
};