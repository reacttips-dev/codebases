'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useEffect, useState } from 'react';
import { setSetting } from 'self-service-api/core/api/settingsApi';
import { getUserInfo } from '../api/getUserInfo';
import { getUserSettings } from '../eligibility/getUserSettings';
import { tracker } from '../eventTracking/tracker';
var THRESHOLD_MULTIPLER = 0.75;
var THIRTY_DAYS_IN_MS = 2592000000;
export var useDismissableWarning = function useDismissableWarning(_ref) {
  var closeable = _ref.closeable,
      limit = _ref.limit,
      source = _ref.source,
      upgradeData = _ref.upgradeData,
      value = _ref.value,
      warningThreshold = _ref.warningThreshold,
      interactionName = _ref.interactionName;

  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      isDismissed = _useState2[0],
      setIsDismissed = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      settingKey = _useState4[0],
      setSettingKey = _useState4[1];

  var hasReachedLimit = value >= limit; // If no warningThreshold is specified, we should
  // default to always showing the banner.

  var shouldShowWarning = warningThreshold ? value >= warningThreshold : true;

  var handleClose = function handleClose() {
    tracker.track(interactionName, Object.assign({
      action: 'dismissed banner',
      value: value,
      limit: limit,
      hasReachedLimit: hasReachedLimit
    }, upgradeData));
    setIsDismissed(true);
    setSetting(settingKey, Date.now());
  };

  useEffect(function () {
    if (closeable) {
      Promise.all([getUserInfo(), getUserSettings()]).then(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            userId = _ref3[0].user.user_id,
            userSettings = _ref3[1];

        var newSettingKey = "upgrades:" + source + "-" + userId + "-dismissed";
        var dismissalTimestamp = userSettings.getIn([newSettingKey, 'value']);

        if (!dismissalTimestamp) {
          setIsDismissed(false);
          setSettingKey(newSettingKey);
          return;
        } // Threshold should either be the specified warningThreshold or 3/4 of the limit


        var threshold = warningThreshold || limit * THRESHOLD_MULTIPLER;
        var isOverThreshold = value >= threshold;
        var msSinceDismissal = Date.now() - Number(dismissalTimestamp);
        var isOverThirtyDays = msSinceDismissal >= THIRTY_DAYS_IN_MS; // If over threshold and it's been more than 30 days since the banner
        // was dismissed, show the banner again

        if (isOverThreshold && isOverThirtyDays) {
          setIsDismissed(false);
        } else {
          setIsDismissed(true);
        }

        setSettingKey(newSettingKey);
      }).catch(function () {
        return setIsDismissed(false);
      });
    } else {
      setIsDismissed(false);
    }
  }, [closeable, limit, source, value, warningThreshold]);
  if (!shouldShowWarning || isDismissed) return {
    showBanner: false
  };
  return {
    handleClose: handleClose,
    hasReachedLimit: hasReachedLimit,
    showBanner: true
  };
};