'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import Loadable from 'UIComponents/decorators/Loadable';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
var AsyncBETActivityTypeSelect = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "bet-activity-types" */
    '../containers/BETActivityTypeSelectContainer');
  },
  // TODO: replace with real components
  LoadingComponent: function LoadingComponent(_ref) {
    var pastDelay = _ref.pastDelay;
    return pastDelay && /*#__PURE__*/_jsx(UILoadingSpinner, {});
  },
  ErrorComponent: function ErrorComponent() {
    return null;
  } // TO-DO add in error modal

});
export default AsyncBETActivityTypeSelect;