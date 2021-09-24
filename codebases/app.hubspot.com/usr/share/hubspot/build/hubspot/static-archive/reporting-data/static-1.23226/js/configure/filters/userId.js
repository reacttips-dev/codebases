'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { Set as ImmutableSet } from 'immutable';
import { userInfo } from '../../request/user-info';
import { NO_ID, MY_USER_ID } from '../../constants/magicTypes';
export default (function (config) {
  var paths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableSet();
  return userInfo().then(function (_ref) {
    var _ref$user = _ref.user;
    _ref$user = _ref$user === void 0 ? {} : _ref$user;
    var _ref$user$user_id = _ref$user.user_id,
        userId = _ref$user$user_id === void 0 ? NO_ID : _ref$user$user_id;
    return paths.reduce(function (memo, path) {
      return memo.updateIn(['filters'].concat(_toConsumableArray(path)), function (value) {
        return value === MY_USER_ID ? userId : NO_ID;
      });
    }, config);
  });
});