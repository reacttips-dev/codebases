'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import ErrorBoundary from 'customer-data-objects-ui-components/ErrorBoundary';
export var withAlertErrorBoundary = function withAlertErrorBoundary(Component) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Component.name;
  return (// Only works if component is a function
    function (props) {
      return /*#__PURE__*/_jsx(ErrorBoundary, {
        ErrorComponent: null,
        boundaryName: name + "_AlertErrorBoundary",
        showRefreshAlert: true,
        children: /*#__PURE__*/_jsx(Component, Object.assign({}, props))
      });
    }
  );
};