'use es6';

function isPrimitive(value) {
  switch (Object.prototype.toString.call(value)) {
    // functions aren't technically primitives but for this purpose
    // we can treat them as though they are
    case '[object Function]':
    case '[object String]':
    case '[object Number]':
    case '[object Boolean]':
    case '[object Null]':
    case '[object Undefined]':
      return true;

    default:
      return false;
  }
} // Adapted from facebook.com's deepEqual implementation
// https://hubspot.slack.com/archives/C0CHG9FGE/p1590770310030500?thread_ts=1590769527.029100&cid=C0CHG9FGE


export function isEqual(obj1, obj2) {
  function getAreArraysEqual(_obj2) {
    return function areArraysEqual(el, idx) {
      return isEqual(el, _obj2[idx]);
    };
  }

  function getAreObjectsEqual(_obj1, _obj2) {
    return function areObjectsEqual(objKey) {
      if (objKey === 'propTypes') return true;
      return objKey in _obj1 && objKey in _obj2 && isEqual(_obj1[objKey], _obj2[objKey]);
    };
  }

  if (Object.prototype.toString.call(obj1) !== Object.prototype.toString.call(obj2)) {
    return false;
  }

  if (isPrimitive(obj1)) return obj1 === obj2;

  if (obj1 instanceof Symbol) {
    return Symbol.prototype.valueOf.call(obj1) === Symbol.prototype.valueOf.call(obj2);
  }

  if (obj1.constructor && obj2.constructor && obj1.constructor !== obj2.constructor) {
    return false;
  } // short circuit for react element comparisons


  if (obj1 && obj1['$$typeof'] && obj2 && obj2['$$typeof']) {
    return obj1 === obj2;
  }

  if (Array.isArray(obj1)) return obj1.length === obj2.length && obj1.every(getAreArraysEqual(obj2));
  var obj1Keys = Object.keys(obj1);
  return obj1Keys.length !== Object.keys(obj2).length ? false : obj1Keys.every(getAreObjectsEqual(obj1, obj2));
}