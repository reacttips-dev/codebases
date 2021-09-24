'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { Component } from 'react';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import { submitAdditionalPqlForm } from 'ui-addon-upgrades/_core/pql/submitPql';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import H2 from 'UIComponents/elements/headings/H2';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UISelect from 'UIComponents/input/UISelect';
import UITextArea from 'UIComponents/input/UITextArea';
import { tracker } from '../common/eventTracking/tracker';
import UIAlert from 'UIComponents/alert/UIAlert';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import { StyledModal } from '../common/components/StyledModal';
var PQL_SUBMISSION_STATUSES = {
  INITIAL: 'initial',
  LOADING: 'loading',
  FAILED: 'failed',
  SUCCEEDED: 'succeeded'
};
var MODAL_CLOSE_DELAY_MILLIS = 800;

var EmailModal = /*#__PURE__*/function (_Component) {
  _inherits(EmailModal, _Component);

  function EmailModal(props) {
    var _this;

    _classCallCheck(this, EmailModal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EmailModal).call(this, props));
    _this._isMounted = true;
    _this.state = {
      subject: null,
      body: '',
      hasClickedSubmit: false,
      pqlSubmissionStatus: PQL_SUBMISSION_STATUSES.INITIAL
    };
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(EmailModal, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMounted = false;
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      var _this2 = this;

      var _this$state = this.state,
          subject = _this$state.subject,
          body = _this$state.body;
      var _this$props = this.props,
          upgradeData = _this$props.upgradeData,
          onClose = _this$props.onClose;
      this.setState({
        hasClickedSubmit: true
      });

      if (subject && body.length) {
        this.setState({
          pqlSubmissionStatus: PQL_SUBMISSION_STATUSES.LOADING
        });
        submitAdditionalPqlForm(Object.assign({}, upgradeData, {
          isAssignable: true,
          isRetail: false
        }), {
          emailSubject: subject,
          emailBody: body
        }).then(function () {
          _this2.setState({
            pqlSubmissionStatus: PQL_SUBMISSION_STATUSES.SUCCEEDED
          });

          tracker.track('communicationMethodsInteraction', Object.assign({
            action: 'submitted email message'
          }, upgradeData));
          setTimeout(function () {
            onClose();
          }, MODAL_CLOSE_DELAY_MILLIS);
        }).catch(function () {
          _this2.setState({
            pqlSubmissionStatus: PQL_SUBMISSION_STATUSES.FAILED
          });
        }).done();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props2 = this.props,
          onClose = _this$props2.onClose,
          hideBackground = _this$props2.hideBackground;
      var _this$state2 = this.state,
          subject = _this$state2.subject,
          body = _this$state2.body,
          hasClickedSubmit = _this$state2.hasClickedSubmit,
          pqlSubmissionStatus = _this$state2.pqlSubmissionStatus;
      return /*#__PURE__*/_jsxs(StyledModal, {
        "data-test-id": "email-modal",
        width: 600,
        hideBackground: hideBackground,
        children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(H2, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "upgrades.emailModal.header"
            })
          }), /*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: onClose
          })]
        }), /*#__PURE__*/_jsxs(UIDialogBody, {
          children: [/*#__PURE__*/_jsx(UIFormControl, {
            label: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "upgrades.emailModal.subject"
            }),
            error: hasClickedSubmit && !subject,
            validationMessage: hasClickedSubmit && !subject && /*#__PURE__*/_jsx(FormattedMessage, {
              message: "upgrades.emailModal.errorMessages.subject"
            }),
            children: /*#__PURE__*/_jsx(UISelect, {
              value: subject,
              "data-test-id": "pql-email-subject-dropdown",
              searchable: false,
              onChange: function onChange(event) {
                _this3.setState({
                  subject: event.target.value
                });
              } //The message subjects are submitted to 53 in English
              ,
              options: [{
                text: I18n.text("upgrades.emailModal.subjectDropdown.options.purchase"),
                value: 'I’m interested in purchasing a product'
              }, {
                text: I18n.text("upgrades.emailModal.subjectDropdown.options.learnMore"),
                value: 'I want to learn more about a product or feature'
              }, {
                text: I18n.text("upgrades.emailModal.subjectDropdown.options.help"),
                value: 'I need setup help or have a technical question'
              }, {
                text: I18n.text("upgrades.emailModal.subjectDropdown.options.other"),
                value: 'Other'
              }],
              placeholder: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "upgrades.emailModal.subjectDropdown.placeholder"
              })
            })
          }), /*#__PURE__*/_jsx(UIFormControl, {
            label: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "upgrades.emailModal.body"
            }),
            error: hasClickedSubmit && body === '',
            validationMessage: hasClickedSubmit && body === '' && /*#__PURE__*/_jsx(FormattedMessage, {
              message: "upgrades.emailModal.errorMessages.body"
            }),
            children: /*#__PURE__*/_jsx(UITextArea, {
              "data-test-id": "pql-email-message-textarea",
              placeholder: I18n.text('upgrades.emailModal.bodyPlaceholder'),
              rows: 10,
              resize: false,
              value: body,
              onChange: function onChange(event) {
                _this3.setState({
                  body: event.target.value
                });
              }
            })
          }), pqlSubmissionStatus === PQL_SUBMISSION_STATUSES.FAILED && /*#__PURE__*/_jsx(UIAlert, {
            className: "m-top-5",
            titleText: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "upgrades.emailModal.submissionErrors.title"
            }),
            type: "danger",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "upgrades.emailModal.submissionErrors.body"
            })
          })]
        }), /*#__PURE__*/_jsxs(UIDialogFooter, {
          children: [/*#__PURE__*/_jsx(UILoadingButton, {
            use: "primary",
            "data-test-id": "pql-email-submit",
            onClick: this.handleSubmit,
            loading: pqlSubmissionStatus === PQL_SUBMISSION_STATUSES.LOADING,
            keepResultAfterFinish: pqlSubmissionStatus !== PQL_SUBMISSION_STATUSES.FAILED,
            failed: pqlSubmissionStatus === PQL_SUBMISSION_STATUSES.FAILED,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "upgrades.emailModal.send"
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            use: "secondary",
            onClick: onClose,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "upgrades.emailModal.cancel"
            })
          })]
        })]
      });
    }
  }]);

  return EmailModal;
}(Component);

export default EmailModal;