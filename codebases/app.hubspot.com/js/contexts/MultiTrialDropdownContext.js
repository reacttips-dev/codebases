'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useState } from 'react';
import { postMessage } from '../utils';
import { useRefWithCallback } from '../useRefWithCallback';
export var MultiTrialDropdownContext = /*#__PURE__*/createContext();
export var MultiTrialDropdownContextProvider = function MultiTrialDropdownContextProvider(_ref) {
  var children = _ref.children;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showDropdown = _useState2[0],
      setShowDropdown = _useState2[1];

  var _useRefWithCallback = useRefWithCallback(null),
      _useRefWithCallback2 = _slicedToArray(_useRefWithCallback, 2),
      switchTrialViewRef = _useRefWithCallback2[0],
      setSwitchTrialViewRef = _useRefWithCallback2[1];

  var setShowMultiTrialDropdown = useCallback(function (shouldShowDropdown) {
    // As of July 2021, at most 5 trials (1 per hub) can be active at once, which requires height === ~300.
    // If more are added, we'll need to increase height here.
    var dropdownHeight = 300;
    var isIFrameAlreadyExtended = window.innerHeight > dropdownHeight;

    if (isIFrameAlreadyExtended) {
      setShowDropdown(shouldShowDropdown);
      return;
    }

    if (shouldShowDropdown) {
      postMessage('HEIGHT_CHANGE', {
        value: dropdownHeight
      }); // Wait 10ms so iframe has time to expand before showing dropdown

      setTimeout(function () {
        setShowDropdown(shouldShowDropdown);
      }, 10);
    } else {
      setShowDropdown(shouldShowDropdown);
      postMessage('HEIGHT_CHANGE', {
        value: 50
      }); // restore original height after dropdown close animation
    }
  }, []);
  return /*#__PURE__*/_jsx(MultiTrialDropdownContext.Provider, {
    value: {
      showMultiTrialDropdown: showDropdown,
      setShowMultiTrialDropdown: setShowMultiTrialDropdown,
      switchTrialViewRef: switchTrialViewRef,
      setSwitchTrialViewRef: setSwitchTrialViewRef
    },
    children: children
  });
};