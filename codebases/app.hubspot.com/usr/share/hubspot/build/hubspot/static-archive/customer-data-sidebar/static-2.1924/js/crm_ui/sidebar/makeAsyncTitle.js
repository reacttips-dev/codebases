'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import Loadable from 'UIComponents/decorators/Loadable';
import UIFlex from 'UIComponents/layout/UIFlex';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';

var LoadingComponent = function LoadingComponent() {
  return /*#__PURE__*/_jsx(UIFlex, {
    justify: "start",
    className: "relative",
    children: /*#__PURE__*/_jsx(UILoadingSpinner, {
      size: "xs"
    })
  });
};

export function makeAsyncTitle(_ref) {
  var loader = _ref.loader;
  return Loadable({
    loader: loader,
    LoadingComponent: LoadingComponent
  });
}