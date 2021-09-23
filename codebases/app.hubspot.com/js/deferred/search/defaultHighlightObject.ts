import RESULT_TYPES from './const/RESULT_TYPES';
export default function () {
  var prop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'name';
  var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var types = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : RESULT_TYPES;
  Object.keys(types).map(function (k) {
    return obj[k] = prop;
  });
  return obj;
}