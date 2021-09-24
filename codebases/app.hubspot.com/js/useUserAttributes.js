'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useEffect, useState } from 'react';
import { fetchUserAttributes } from 'self-service-api/core/api/userAttributesApi';
export var useUserAttributes = function useUserAttributes(showFlydown, userAttributesKey) {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      userAttributes = _useState2[0],
      setUserAttributes = _useState2[1];

  useEffect(function () {
    if (showFlydown) return; // Only re-fetch whenever the flydown is closed

    var uriKey = encodeURIComponent(userAttributesKey);
    fetchUserAttributes(uriKey).then(function (userAttributesResponse) {
      setUserAttributes(userAttributesResponse.attributes);
    });
  }, [showFlydown, userAttributesKey]);
  return userAttributes;
};