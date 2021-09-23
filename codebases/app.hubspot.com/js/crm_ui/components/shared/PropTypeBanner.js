'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import enviro from 'enviro';
import { List } from 'immutable';
import { useEffect, useState } from 'react';
import SafeStorage from 'SafeStorage';
import styled from 'styled-components';
import UIAlert from 'UIComponents/alert/UIAlert';
import UIBox from 'UIComponents/layout/UIBox';
import UITruncateString from 'UIComponents/text/UITruncateString';
var SELENIUM_DISABLE_BANNERS_KEY = 'selenium.disable.banners';
var PropTypeAlert = styled(UIAlert).withConfig({
  displayName: "PropTypeBanner__PropTypeAlert",
  componentId: "z3vpxr-0"
})(["overflow:auto;"]);

var PropTypeBanner = function PropTypeBanner() {
  var _useState = useState(List()),
      _useState2 = _slicedToArray(_useState, 2),
      errors = _useState2[0],
      setErrors = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      hideAlert = _useState4[0],
      setHideAlert = _useState4[1];

  var isDeployed = enviro.deployed();
  var disableBannersForSelenium = SafeStorage.getItem(SELENIUM_DISABLE_BANNERS_KEY) === 'true';
  useEffect(function () {
    // do not show on qa, prod, selenium tests, or in iframes
    if (isDeployed || disableBannersForSelenium || window.parent !== window) {
      return function () {};
    }

    var originalConsoleError = window.console.error;

    window.console.error = function () {
      var message = arguments.length <= 0 ? undefined : arguments[0];

      if (("" + message).indexOf('Failed prop type:') !== -1) {
        setTimeout(function () {
          return setErrors(function (existingErrors) {
            return existingErrors.push(message);
          });
        });
      }

      originalConsoleError.apply(void 0, arguments);
    };

    return function cleanup() {
      window.console.error = originalConsoleError;
    };
  });

  if (isDeployed || errors.size === 0 || hideAlert || disableBannersForSelenium) {
    return null;
  }

  return /*#__PURE__*/_jsx(UIBox, {
    children: /*#__PURE__*/_jsx(PropTypeAlert, {
      closeable: true,
      onClose: function onClose() {
        return setHideAlert(true);
      },
      use: "inline",
      type: "danger",
      titleText: "Help keep the console tidy! There's " + errors.size + " prop type warning" + (errors.size > 1 ? 's' : ''),
      children: errors.map(function (message, index) {
        return /*#__PURE__*/_jsx(UITruncateString, {
          tooltip: false,
          children: message
        }, index);
      })
    })
  });
};

export default PropTypeBanner;