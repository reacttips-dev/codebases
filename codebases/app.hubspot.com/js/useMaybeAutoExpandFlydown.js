'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useEffect, useState } from 'react';
import { setSetting as setPortalSetting } from 'self-service-api/core/api/settingsApi';
export var useMaybeAutoExpandFlydown = function useMaybeAutoExpandFlydown(portalSettings, openFlydown) {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      hasAutoExpanded = _useState2[0],
      setHasAutoExpanded = _useState2[1]; // Keeps track of if the flydown has expanded on load already


  useEffect(function () {
    if (!portalSettings || hasAutoExpanded) return;
    var shouldAutoExpandSetting = portalSettings.find(function (_ref) {
      var key = _ref.key;
      return key === 'trial-banner-auto-expand';
    });

    if (shouldAutoExpandSetting && shouldAutoExpandSetting.value === 'true') {
      openFlydown();
      setPortalSetting('trial-banner-auto-expand', undefined);
      setHasAutoExpanded(true);
    } else {
      setHasAutoExpanded(true);
    }
  }, [portalSettings, openFlydown, setHasAutoExpanded, hasAutoExpanded]);
};