'use es6';

import { Record } from 'immutable';
export var types = {
  SET_USER_INFO: '@@reporting/SET_USER_INFO',
  CLEAR_USER_INFO: '@@reporting/CLEAR_USER_INFO'
};
export var UserInfoState = Record({
  promise: null,
  data: null
}, 'UserInfoState');
export var initialState = new UserInfoState();
export var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      _action$data = action.data,
      data = _action$data === void 0 ? {} : _action$data;

  switch (type) {
    case types.SET_USER_INFO:
      {
        var _data$promise = data.promise,
            promise = _data$promise === void 0 ? state.promise : _data$promise,
            _data$userInfo = data.userInfo,
            userInfo = _data$userInfo === void 0 ? state.data : _data$userInfo;
        return state.set('promise', promise).set('data', userInfo);
      }

    case types.CLEAR_USER_INFO:
      {
        return initialState;
      }

    default:
      {
        return state;
      }
  }
};
export var actions = {
  setUserInfo: function setUserInfo(_ref) {
    var promise = _ref.promise,
        userInfo = _ref.userInfo;
    return {
      type: types.SET_USER_INFO,
      data: {
        promise: promise,
        userInfo: userInfo
      }
    };
  },
  clearUserInfo: function clearUserInfo() {
    return {
      type: types.CLEAR_USER_INFO
    };
  }
};