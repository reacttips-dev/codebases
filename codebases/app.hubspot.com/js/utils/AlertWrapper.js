'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, createContext, useContext, useRef, useCallback, useMemo } from 'react';
import { getParentWindow } from './parentWindowUtils';
import AlertListTransition from 'UIComponents/alert/AlertListTransition';
import UIFloatingAlert from 'UIComponents/alert/UIFloatingAlert';
import styled from 'styled-components';
import Layer from './Layer';
import { URANUS_LAYER } from 'HubStyleTokens/sizes';
import emptyFunction from 'react-utils/emptyFunction';
var AlertContext = /*#__PURE__*/createContext();
export var useSetAlert = function useSetAlert() {
  var alertState = useContext(AlertContext);
  return alertState && alertState[1] ? alertState[1] : emptyFunction;
};
var AlertChildContainer = styled.div.withConfig({
  displayName: "AlertWrapper__AlertChildContainer",
  componentId: "q5x0zf-0"
})(["left:0;overflow:auto;position:absolute;top:0;width:100%;"]);
var AlertContainer = styled.div.withConfig({
  displayName: "AlertWrapper__AlertContainer",
  componentId: "q5x0zf-1"
})(["display:block;left:0;pointer-events:none;position:fixed;text-align:center;top:74px;width:100%;z-index:", ";"], URANUS_LAYER);
export var AlertWrapper = function AlertWrapper(_ref) {
  var children = _ref.children;
  var parent = getParentWindow();

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      alert = _useState2[0],
      setAlert = _useState2[1];

  var timeout = useRef();
  var removeAlert = useCallback(function () {
    setAlert();
    timeout.current = undefined;
  }, []);
  var addAlert = useCallback(function (newAlert) {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(removeAlert, 4000);
    setAlert(newAlert);
  }, [removeAlert]);
  var renderedAlert = useMemo(function () {
    return alert ? /*#__PURE__*/_jsx(UIFloatingAlert, {
      className: "m-bottom-4",
      titleText: alert.titleText,
      type: alert.type,
      closeable: true,
      onClose: removeAlert,
      children: alert.message
    }, 0) : undefined;
  }, [alert, removeAlert]);
  return /*#__PURE__*/_jsxs(AlertContext.Provider, {
    value: [alert, addAlert],
    children: [parent && /*#__PURE__*/_jsx(Layer, {
      rootNode: parent.document.body,
      head: parent.document.head,
      name: "trial-banner-alerts",
      children: /*#__PURE__*/_jsx(AlertContainer, {
        children: /*#__PURE__*/_jsx(AlertChildContainer, {
          children: /*#__PURE__*/_jsx(AlertListTransition, {
            children: [renderedAlert]
          })
        })
      })
    }), children]
  });
};
export default AlertWrapper;