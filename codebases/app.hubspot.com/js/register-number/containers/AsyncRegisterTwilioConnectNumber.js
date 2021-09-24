'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import Loadable from 'UIComponents/decorators/Loadable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIAlert from 'UIComponents/alert/UIAlert';
import UIButton from 'UIComponents/button/UIButton';
import TwilioConnectRegisterNumberSkeleton from 'calling-settings-ui-library/number-registration/components/TwilioConnectRegisterNumberSkeleton';

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

export var AsyncRegisterTwilioConnectNumber = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "registerTwilioConnectNumber" */
    'calling-settings-ui-library/number-registration/containers/RegisterTwilioConnectNumberContainer');
  },
  LoadingComponent: function LoadingComponent(_ref2) {
    var pastDelay = _ref2.pastDelay;
    return pastDelay && /*#__PURE__*/_jsx(TwilioConnectRegisterNumberSkeleton, {});
  },
  ErrorComponent: ErrorComponent
});
export default AsyncRegisterTwilioConnectNumber;