'use es6';

import ActionMapper from '../../lib/legacyRequestActionMapper';

var makeSnake = function makeSnake(str) {
  return str.replace(/([A-Z])/g, function (c) {
    return "_" + c.toLowerCase();
  }).toUpperCase();
};

var makeNetworkReducer = function makeNetworkReducer(_ref) {
  var label = _ref.label;
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var prefix = makeSnake(label);

    switch (action.type) {
      case ActionMapper.began(prefix):
        return 100;

      case ActionMapper.success(prefix):
        return 200;

      case ActionMapper.error(prefix):
        return action.error.status;

      default:
        return state;
    }
  };
};

export default (function (state, action) {
  return state.reduce(function (s, v, k) {
    return s.set(k, makeNetworkReducer({
      label: k
    })(v, action));
  }, state);
});