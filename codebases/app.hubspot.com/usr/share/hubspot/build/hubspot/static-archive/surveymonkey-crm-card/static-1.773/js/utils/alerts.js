'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import UIButton from 'UIComponents/button/UIButton';
import UIButtonWrapper from 'UIComponents/layout/UIButtonWrapper';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
var surveySentAlertId = 'surveySentAlertId';

var Alerts = /*#__PURE__*/function () {
  function Alerts() {
    _classCallCheck(this, Alerts);
  }

  _createClass(Alerts, null, [{
    key: "displaySuccessSendingSurveyAlert",
    value: function displaySuccessSendingSurveyAlert(surveyTitle, cancelSendingFunc, selectedManyContacts) {
      var alertMessage = selectedManyContacts ? 'sidebar.alert.surveySent.message.forManyContacts' : 'sidebar.alert.surveySent.message.forOneContact';
      FloatingAlertStore.addAlert({
        id: surveySentAlertId,
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sidebar.alert.surveySent.title"
        }),
        message: /*#__PURE__*/_jsxs(UIButtonWrapper, {
          children: [/*#__PURE__*/_jsx(FormattedMessage, {
            message: alertMessage,
            options: {
              survey: surveyTitle
            }
          }), /*#__PURE__*/_jsx(UIButton, {
            external: false,
            size: "extra-small",
            use: "tertiary",
            onClick: cancelSendingFunc,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sidebar.alert.surveySent.undoButton"
            })
          })]
        }),
        type: 'success'
      });
    }
  }, {
    key: "displaySuccessUndoSendingSurveyAlert",
    value: function displaySuccessUndoSendingSurveyAlert(surveyTitle, selectedManyContacts) {
      var alertMessage = selectedManyContacts ? 'sidebar.alert.undoSending.message.forManyContacts' : 'sidebar.alert.undoSending.message.forOneContact';
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sidebar.alert.undoSending.title"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: alertMessage,
          options: {
            survey: surveyTitle
          }
        }),
        type: 'success'
      });
      FloatingAlertStore.removeAlert(surveySentAlertId);
    }
  }]);

  return Alerts;
}();

export default Alerts;