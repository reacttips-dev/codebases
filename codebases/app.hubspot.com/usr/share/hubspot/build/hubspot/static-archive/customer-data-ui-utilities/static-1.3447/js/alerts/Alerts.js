'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import env from 'enviro';
import partial from 'transmute/partial';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';

var add = function add(type, message) {
  var messageOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (!I18n.lookup(message) && messageOptions._defaultMessage && I18n.lookup(messageOptions._defaultMessage)) {
    message = messageOptions._defaultMessage;
  }

  if (I18n.lookup(message)) {
    message = /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: message,
      options: messageOptions
    });
  } else if (!env.deployed()) {
    // eslint-disable-next-line no-console
    console.warn('Alert key not translated: ', message);

    if (messageOptions._defaultMessage) {
      // eslint-disable-next-line no-console
      console.warn('Alert default key not translated: ', messageOptions._defaultMessage);
    }
  }

  for (var _len = arguments.length, alertOptions = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    alertOptions[_key - 3] = arguments[_key];
  }

  FloatingAlertStore.addAlert(Object.assign.apply(Object, [{
    message: message,
    type: type,
    'data-alert-type': type
  }].concat(alertOptions)));
};

export var addAlert = function addAlert() {
  return FloatingAlertStore.addAlert.apply(FloatingAlertStore, arguments);
};
export var addError = partial(add, 'danger');
export var addWarning = partial(add, 'warning');
export var addSuccess = partial(add, 'success');
export var addDanger = partial(add, 'danger');