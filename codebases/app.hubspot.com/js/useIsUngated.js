'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useState, useEffect } from 'react';
import { getUserInfo } from 'ui-addon-upgrades/_core/common/api/getUserInfo';
import withGateOverride from './utils/withGateOverride';
export var useIsUngated = function useIsUngated(gateKey) {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      gates = _useState2[0],
      setGates = _useState2[1];

  useEffect(function () {
    getUserInfo().then(function (userInfo) {
      setGates(userInfo.gates);
    });
  }, []);

  if (gates === null) {
    return gates;
  }

  var isUngated = gates.includes(gateKey);
  return withGateOverride(gateKey, isUngated);
};