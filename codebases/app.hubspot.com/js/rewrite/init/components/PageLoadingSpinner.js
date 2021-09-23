'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';

var PageLoadingSpinner = function PageLoadingSpinner() {
  return /*#__PURE__*/_jsx(UILoadingSpinner, {
    grow: true,
    minHeight: 500
  });
};

export default PageLoadingSpinner;