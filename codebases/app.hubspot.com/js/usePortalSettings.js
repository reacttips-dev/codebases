'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useEffect, useState } from 'react';
import PortalIdParser from 'PortalIdParser';
import http from 'hub-http/clients/apiClient';
export var usePortalSettings = function usePortalSettings(showFlydown) {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      portalSettings = _useState2[0],
      setPortalSettings = _useState2[1];

  useEffect(function () {
    if (showFlydown) return; // Only re-fetch whenever the flydown is closed
    // We don't use fetchSetting() from self-service-api bc we don't want it to be memoized - we need to be able to refetch

    http.get("hubs-settings/v1/hubs/" + PortalIdParser.get() + "/settings").then(function (portalSettingsResponse) {
      return setPortalSettings(portalSettingsResponse.settings);
    });
  }, [showFlydown]);
  return portalSettings;
};