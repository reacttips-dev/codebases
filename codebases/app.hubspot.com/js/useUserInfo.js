'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useState, useEffect } from 'react';
import { getUserInfo } from 'ui-addon-upgrades/_core/common/api/getUserInfo';
export var useUserInfo = function useUserInfo() {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      user = _useState2[0],
      setUser = _useState2[1];

  useEffect(function () {
    getUserInfo().then(function (_ref) {
      var userInfo = _ref.user;
      setUser(userInfo);
    });
  }, []);
  return user;
};