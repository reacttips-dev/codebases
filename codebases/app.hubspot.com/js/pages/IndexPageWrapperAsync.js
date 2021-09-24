'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import Loadable from 'UIComponents/decorators/Loadable';
import UILoadingOverlay from 'UIComponents/loading/UILoadingOverlay';
var IndexPageWrapperAsync = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "index-page" */
    'crm-index-ui/pages/IndexPageWrapper');
  },
  LoadingComponent: function DefaultLoader() {
    return /*#__PURE__*/_jsx(UILoadingOverlay, {
      "data-reason": "IndexPageWrapperAsync: code split"
    });
  }
});
export default IndexPageWrapperAsync;