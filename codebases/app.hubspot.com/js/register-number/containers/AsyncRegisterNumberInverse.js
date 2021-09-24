'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import Loadable from 'UIComponents/decorators/Loadable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIAlert from 'UIComponents/alert/UIAlert';
import UIButton from 'UIComponents/button/UIButton';
import HubSpotRegisterNumberSkeleton from 'calling-settings-ui-library/number-registration/components/HubSpotRegisterNumberSkeleton';

var ErrorComponent = function ErrorComponent(_ref) {
  var retry = _ref.retry;
  return /*#__PURE__*/_jsx(UIAlert, {
    titleText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "registerNumber.asyncError.title"
    }),
    type: "danger",
    children: /*#__PURE__*/_jsx(UIButton, {
      use: "link",
      onClick: retry,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "registerNumber.asyncError.retryCTA"
      })
    })
  });
};

export var AsyncRegisterNumberInverse = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "registerNumberInverse" */
    'calling-settings-ui-library/number-registration/containers/RegisterNumberInverseContainer');
  },
  LoadingComponent: function LoadingComponent(_ref2) {
    var pastDelay = _ref2.pastDelay;
    return pastDelay && /*#__PURE__*/_jsx(HubSpotRegisterNumberSkeleton, {});
  },
  ErrorComponent: ErrorComponent
});
export default AsyncRegisterNumberInverse;