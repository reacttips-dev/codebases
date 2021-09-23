'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import Loadable from 'UIComponents/decorators/Loadable';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import CallingUsageBaseMessageContainer from '../containers/CallingUsageBaseMessageContainer';
var AsyncCallingUsageUpgradeBanner = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "calling-usage-limit" */
    './CallingUsageUpgradeBanner');
  },
  LoadingComponent: function LoadingComponent(_ref) {
    var pastDelay = _ref.pastDelay;
    return pastDelay && /*#__PURE__*/_jsx(UILoadingSpinner, {});
  },
  ErrorComponent: CallingUsageBaseMessageContainer
});
export default AsyncCallingUsageUpgradeBanner;