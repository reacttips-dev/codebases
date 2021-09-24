'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UILoadingOverlay from 'UIComponents/loading/UILoadingOverlay';

var Loading = function Loading(_ref) {
  var loading = _ref.loading;
  return loading ? /*#__PURE__*/_jsx(UILoadingOverlay, {
    contextual: true
  }) : null;
};

export default Loading;