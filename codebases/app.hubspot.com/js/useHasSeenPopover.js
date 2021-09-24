'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useEffect, useState } from 'react';
import { useUserAttributes } from './useUserAttributes';
import { setUserAttribute } from 'self-service-api/core/api/userAttributesApi'; // A hook that returns a boolean as to whether a user should see the
// popover that correlates with the provided userAttributesKey

export var useHasSeenPopover = function useHasSeenPopover(showFlydown, userAttributesKey) {
  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      hasSeenPopover = _useState2[0],
      setHasSeenPopover = _useState2[1]; // Default to true so users don't see it when they're not supposed to


  var userAttributes = useUserAttributes(showFlydown, userAttributesKey);
  useEffect(function () {
    if (!userAttributes) return;
    var hasSeenTrialGuidePopoverSetting = userAttributes.find(function (_ref) {
      var key = _ref.key;
      return key === userAttributesKey;
    });

    if (hasSeenTrialGuidePopoverSetting && hasSeenTrialGuidePopoverSetting.value === 'true') {
      setHasSeenPopover(true);
    } else {
      setHasSeenPopover(false);
      setUserAttribute(userAttributesKey, 'true');
    }
  }, [userAttributes, userAttributesKey]);
  return hasSeenPopover;
};