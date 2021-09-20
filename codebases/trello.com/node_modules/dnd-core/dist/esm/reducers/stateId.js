export function reduce() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return state + 1;
}