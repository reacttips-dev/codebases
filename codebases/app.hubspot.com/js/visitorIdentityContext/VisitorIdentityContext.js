'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { getIsFirstVisitorSessionParam } from '../query-params/getIsFirstVisitorSessionParam';
export var throwErrorWhenContextUsedBeforeInstantiated = function throwErrorWhenContextUsedBeforeInstantiated() {
  throw new Error('visitorIdentity context was used before its value got instantiated');
};
export var defaultVisitorIdentityContext = {
  getIsFirstVisitorSession: throwErrorWhenContextUsedBeforeInstantiated,
  setIsFirstVisitorSession: throwErrorWhenContextUsedBeforeInstantiated,
  setIsPrivateWidgetLoad: throwErrorWhenContextUsedBeforeInstantiated,
  getIsPrivateWidgetLoad: throwErrorWhenContextUsedBeforeInstantiated
};
export var VisitorIdentityContext = /*#__PURE__*/createContext(defaultVisitorIdentityContext);
export var VisitorIdentityContextProvider = function VisitorIdentityContextProvider(_ref) {
  var children = _ref.children;

  var _useState = useState(getIsFirstVisitorSessionParam()),
      _useState2 = _slicedToArray(_useState, 2),
      isFirstVisitorSession = _useState2[0],
      setIsFirstVisitorSession = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isPrivateWidgetLoad = _useState4[0],
      setIsPrivateWidgetLoad = _useState4[1];

  var getIsFirstVisitorSession = function getIsFirstVisitorSession() {
    if (isPrivateWidgetLoad) {
      return false;
    }

    return isFirstVisitorSession;
  };

  var getIsPrivateWidgetLoad = function getIsPrivateWidgetLoad() {
    return isPrivateWidgetLoad;
  };

  return /*#__PURE__*/_jsx(VisitorIdentityContext.Provider, {
    value: {
      getIsFirstVisitorSession: getIsFirstVisitorSession,
      setIsFirstVisitorSession: setIsFirstVisitorSession,
      setIsPrivateWidgetLoad: setIsPrivateWidgetLoad,
      getIsPrivateWidgetLoad: getIsPrivateWidgetLoad
    },
    children: children
  });
};
VisitorIdentityContextProvider.displayName = 'VisitorIdentityContextProvider';
VisitorIdentityContextProvider.propTypes = {
  children: PropTypes.node
};
export var ConsumeVisitorIdentityContext = function ConsumeVisitorIdentityContext(TheComponent) {
  var TheComponentWithContext = function TheComponentWithContext(props) {
    var visitorIdentity = useContext(VisitorIdentityContext);
    return /*#__PURE__*/_jsx(TheComponent, Object.assign({}, props, {
      visitorIdentity: visitorIdentity
    }));
  };

  TheComponentWithContext.displayName = "ConsumeVisitorIdentityContext(" + TheComponent.displayName + ")";
  return TheComponentWithContext;
};
ConsumeVisitorIdentityContext.displayName = 'ConsumeVisitorIdentityContext';