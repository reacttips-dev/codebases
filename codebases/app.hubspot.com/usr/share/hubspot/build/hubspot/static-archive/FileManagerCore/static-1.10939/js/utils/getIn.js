'use es6';

export default function getIn(obj, path) {
  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var val = obj;
  var idx = 0;

  if (typeof path === 'string') {
    if (obj[path]) {
      return obj[path];
    }

    return defaultValue;
  }

  while (idx < path.length) {
    if (val[path[idx]] === null || val[path[idx]] === undefined) {
      return defaultValue;
    }

    val = val[path[idx]];
    idx += 1;
  }

  return val;
}