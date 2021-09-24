'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UILoadingOverlay from 'UIComponents/loading/UILoadingOverlay';
import SidebarCardError from 'customer-data-sidebar/SidebarCardError';
import Loadable from 'UIComponents/decorators/Loadable';
import AsyncComponentErrorHandler from 'customer-data-sidebar/crm_ui/utils/AsyncComponentErrorHandler';
import UIFlex from 'UIComponents/layout/UIFlex';

var LoadingComponent = function LoadingComponent() {
  return /*#__PURE__*/_jsx(UIFlex, {
    align: "center",
    justify: "center",
    className: "relative",
    style: {
      height: 250
    },
    children: /*#__PURE__*/_jsx(UILoadingOverlay, {
      contextual: true
    })
  });
};

export function makeAsyncCard(_ref) {
  var chunkName = _ref.chunkName,
      loader = _ref.loader;
  var handleError = AsyncComponentErrorHandler(chunkName);
  var retries = 1;
  return Loadable({
    loader: loader,
    LoadingComponent: LoadingComponent,
    ErrorComponent: function ErrorComponent(_ref2) {
      var error = _ref2.error,
          retry = _ref2.retry;
      handleError(error);

      if (retries > 0) {
        retry();
        retries -= 1;
        return /*#__PURE__*/_jsx(LoadingComponent, {});
      } else {
        return /*#__PURE__*/_jsx(SidebarCardError, {});
      }
    }
  });
}