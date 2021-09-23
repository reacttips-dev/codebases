'use es6';

export default (function (_ref) {
  var viewFilters = _ref.viewFilters;
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : viewFilters;
    return state;
  };
});