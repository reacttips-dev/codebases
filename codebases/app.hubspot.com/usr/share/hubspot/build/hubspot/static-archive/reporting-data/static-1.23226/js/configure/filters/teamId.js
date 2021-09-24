'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { Set as ImmutableSet } from 'immutable';
import { userInfo } from '../../request/user-info';
import { NO_ID, MY_TEAM_ID } from '../../constants/magicTypes';
export default (function (config) {
  var paths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableSet();
  return userInfo().then(function (_ref) {
    var teams = _ref.user.teams;

    var _ref2 = teams.find(function (_ref3) {
      var my_team = _ref3.my_team;
      return my_team;
    }) || {},
        myTeamId = _ref2.id;

    return paths.reduce(function (memo, path) {
      return memo.updateIn(['filters'].concat(_toConsumableArray(path)), function (value) {
        return value === MY_TEAM_ID && myTeamId || NO_ID;
      });
    }, config);
  });
});