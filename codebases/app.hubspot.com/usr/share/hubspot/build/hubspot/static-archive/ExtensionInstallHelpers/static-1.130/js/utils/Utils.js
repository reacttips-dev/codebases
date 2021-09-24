'use es6';

import env from 'enviro';
export function isFunction(func) {
  return typeof func === 'function';
}
export function isStringInDomain(str) {
  return window.location.host.indexOf(str) !== -1;
}
export function objectDoesExist() {
  var baseObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  var objectArray = arguments.length > 1 ? arguments[1] : undefined;
  var objectArrayLength = objectArray.length;
  var obj = baseObject[objectArray[0]]; // Object does not exist at this path

  if (typeof obj === 'undefined' || obj === null) {
    return false;
  } // Traverse the object path array until we hit the end


  if (objectArrayLength > 1 && typeof obj === 'object') {
    return objectDoesExist(obj, objectArray.slice(1, objectArrayLength));
  }

  return true;
}
export var domainSuffix = function () {
  if (env.getShort() === 'qa') {
    return 'qa';
  }

  return '';
}();