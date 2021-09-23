'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useEffect, useState, useRef } from 'react';
import { getDaysInTrialRemaining } from './getDaysInTrialRemaining';
import { getTrialFromTrialState } from './queryParamUtils'; // 30 minutes

var UPDATE_BANNER_INTERVAL = 1000 * 60 * 30;
export var useDaysRemaining = function useDaysRemaining(_ref) {
  var preferredTrialUpgradeProduct = _ref.preferredTrialUpgradeProduct;
  var preferredTrial = getTrialFromTrialState(preferredTrialUpgradeProduct);
  var expiresAt = preferredTrial.expiresAt;
  var previousIntervalRef = useRef();

  var _useState = useState(getDaysInTrialRemaining(expiresAt)),
      _useState2 = _slicedToArray(_useState, 2),
      daysRemaining = _useState2[0],
      setDaysRemaining = _useState2[1];

  useEffect(function () {
    if (previousIntervalRef.current) {
      clearInterval(previousIntervalRef.current);
    }

    setDaysRemaining(getDaysInTrialRemaining(expiresAt));
    var newInterval = setInterval(function () {
      setDaysRemaining(getDaysInTrialRemaining(expiresAt));
    }, UPDATE_BANNER_INTERVAL);
    previousIntervalRef.current = newInterval;
    return function () {
      return clearInterval(previousIntervalRef.current);
    };
  }, [expiresAt]);
  return daysRemaining;
};