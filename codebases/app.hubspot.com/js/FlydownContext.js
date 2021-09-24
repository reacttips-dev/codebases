'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState } from 'react';
export var FlydownContext = /*#__PURE__*/createContext();
export function FlydownContextProvider(_ref) {
  var children = _ref.children;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showFlydown = _useState2[0],
      setShowFlydown = _useState2[1];

  return /*#__PURE__*/_jsx(FlydownContext.Provider, {
    value: {
      showFlydown: showFlydown,
      setShowFlydown: setShowFlydown
    },
    children: children
  });
}