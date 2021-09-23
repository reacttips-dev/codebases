'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { Set as ImmutableSet } from 'immutable';
import { NO_ID, MY_OWNER_ID } from '../../constants/magicTypes';
import { Promise } from '../../lib/promise';
import { userInfo } from '../../request/user-info';
import * as owners from '../../references/owner/owners';

var findOwner = function findOwner(_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      userId = _ref2[0].user.user_id,
      response = _ref2[1];

  return response.reduce(function (memo, _ref3) {
    var remoteList = _ref3.remoteList;
    return [].concat(_toConsumableArray(memo), _toConsumableArray(remoteList));
  }, []).find(function (_ref4) {
    var remoteId = _ref4.remoteId;
    return String(userId) === remoteId;
  });
};

export default (function (config) {
  var paths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableSet();
  return Promise.all([userInfo(), owners.get()]).then(findOwner).then(function () {
    var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref5$ownerId = _ref5.ownerId,
        ownerId = _ref5$ownerId === void 0 ? NO_ID : _ref5$ownerId;

    return paths.reduce(function (memo, path) {
      return memo.updateIn(['filters'].concat(_toConsumableArray(path)), function (value) {
        return value === MY_OWNER_ID && ownerId != null ? ownerId : NO_ID;
      });
    }, config);
  });
});