'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import ErrorBoundary from 'customer-data-objects-ui-components/ErrorBoundary';
import FullPageError from './FullPageError';
export var withFullPageErrorBoundary = function withFullPageErrorBoundary(Component) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Component.name;
  return (// Only works if component is a function
    function (props) {
      return /*#__PURE__*/_jsx(ErrorBoundary, {
        ErrorComponent: FullPageError,
        boundaryName: name + "_FullPageError",
        children: /*#__PURE__*/_jsx(Component, Object.assign({}, props))
      });
    }
  );
};