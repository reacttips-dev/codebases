'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';

var alert = function alert(_ref) {
  var type = _ref.type,
      title = _ref.title,
      message = _ref.message,
      options = _ref.options;
  return FloatingAlertStore.addAlert(Object.assign({
    type: type,
    titleText: title,
    message: message
  }, options));
};

export var alertSuccess = function alertSuccess(_ref2) {
  var _ref2$title = _ref2.title,
      title = _ref2$title === void 0 ? /*#__PURE__*/_jsx(FormattedMessage, {
    message: "index.alerts.generic.success.title"
  }) : _ref2$title,
      message = _ref2.message,
      options = _ref2.options;
  return alert({
    type: 'success',
    title: title,
    message: message,
    options: options
  });
};
export var alertFailure = function alertFailure(_ref3) {
  var title = _ref3.title,
      _ref3$message = _ref3.message,
      message = _ref3$message === void 0 ? /*#__PURE__*/_jsx(FormattedMessage, {
    message: "index.alerts.generic.failure.message"
  }) : _ref3$message,
      options = _ref3.options;
  return alert({
    type: 'danger',
    title: title,
    message: message,
    options: options
  });
};