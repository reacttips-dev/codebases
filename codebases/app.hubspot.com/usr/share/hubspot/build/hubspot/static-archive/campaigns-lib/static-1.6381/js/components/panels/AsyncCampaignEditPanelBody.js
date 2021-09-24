'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import Loadable from 'UIComponents/decorators/Loadable';
import AsyncErrorPanelBody from './AsyncErrorPanelBody';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
export default Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "campaign-edit-panel-body" */
    './CampaignEditPanelBody').then(function (mod) {
      return mod.default;
    });
  },
  LoadingComponent: function LoadingComponent(_ref) {
    var pastDelay = _ref.pastDelay;
    return pastDelay && /*#__PURE__*/_jsx(UILoadingSpinner, {
      layout: "centered",
      grow: true,
      size: "md"
    });
  },
  ErrorComponent: AsyncErrorPanelBody
});