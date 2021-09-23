'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import { Map as ImmutableMap, List } from 'immutable';
import { getEnrollButtonError } from 'sales-modal/utils/enrollModal/getEnrollButtonError';
import { sendLimitLearnMore } from 'sales-modal/lib/links';
import { POST_PROCESS_ERROR_ID } from 'sales-modal/constants/BulkEnrollConstants';
import { UsageTracker } from 'sales-modal/utils/enrollModal/UsageLogger';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UILink from 'UIComponents/link/UILink';
import SalesModalAlertsStore from 'sales-modal/utils/SalesModalAlertsStore';
import UIFlex from 'UIComponents/layout/UIFlex';
import EnrollmentSenderAndRecipientInfo from './EnrollmentSenderAndRecipientInfo';
import SendTimeAlertContainer from 'sales-modal/components/enrollModal/SendTimeAlertContainer';
import DailyEmailLimit from 'sales-modal/components/enrollModal/DailyEmailLimit';
import postProcessSequenceEnrollment from 'sales-modal/utils/enrollModal/postProcessSequenceEnrollment';
import isFirstEditableStepEmail from 'sales-modal/utils/enrollModal/isFirstEditableStepEmail';
import { EnrollTypes, EnrollTypePropType } from 'sales-modal/constants/EnrollTypes';
export default createReactClass({
  displayName: "EnrollmentEditorFooter",
  mixins: [PureRenderMixin],
  propTypes: {
    sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord).isRequired,
    originalEnrollment: PropTypes.instanceOf(ImmutableMap),
    email: PropTypes.string.isRequired,
    enrollType: EnrollTypePropType.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    setEnrollmentProgress: PropTypes.func.isRequired,
    stepsWithSendTimeErrors: PropTypes.instanceOf(ImmutableMap).isRequired,
    isFirstStepWithCloseToSendLimitWarningToday: PropTypes.bool.isRequired,
    hasMadeChanges: PropTypes.bool,
    recommendedSendTimes: PropTypes.instanceOf(List),
    sequenceEnrollmentHasErrors: PropTypes.bool.isRequired,
    erroringSteps: PropTypes.instanceOf(ImmutableMap),
    isUploadingImage: PropTypes.bool.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      pendingSingleEnroll: null
    };
  },
  updateEnrollmentProgress: function updateEnrollmentProgress(postProcessedEnrollment, status) {
    this.props.setEnrollmentProgress(status);
  },
  handleCloseErrorAlert: function handleCloseErrorAlert(error) {
    if (SalesModalAlertsStore.getAlerts()[error]) {
      SalesModalAlertsStore.removeAlert(error);
    }
  },
  confirm: function confirm() {
    var _this = this;

    var _this$props = this.props,
        sequenceEnrollment = _this$props.sequenceEnrollment,
        email = _this$props.email,
        onConfirm = _this$props.onConfirm,
        originalEnrollment = _this$props.originalEnrollment,
        recommendedSendTimes = _this$props.recommendedSendTimes;

    if (!this.state.pendingSingleEnroll) {
      this.setState({
        pendingSingleEnroll: true
      });
      this.handleCloseErrorAlert(POST_PROCESS_ERROR_ID);
      this.trackEnrollButtonClick();
      postProcessSequenceEnrollment({
        sequenceEnrollments: ImmutableMap(_defineProperty({}, sequenceEnrollment.id, sequenceEnrollment)),
        originalEnrollment: originalEnrollment,
        recommendedSendTimes: recommendedSendTimes
      }).then(function (postProcessedEnrollment) {
        var finalizedEnrollment = ImmutableMap.isMap(postProcessedEnrollment) ? postProcessedEnrollment.first() : postProcessedEnrollment;

        var boundUpdateEnrollmentProgress = _this.updateEnrollmentProgress.bind(_this, {
          postProcessedEnrollment: finalizedEnrollment
        });

        onConfirm({
          enrollment: finalizedEnrollment,
          email: email,
          updateEnrollmentProgress: boundUpdateEnrollmentProgress
        }, boundUpdateEnrollmentProgress);
      }, function (err) {
        SalesModalAlertsStore.addAlert({
          titleText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "enrollmentError.title"
          }),
          message: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "enrollmentError.message"
          }),
          type: 'danger',
          use: 'inline',
          id: POST_PROCESS_ERROR_ID
        });
        throw err;
      }).finally(function () {
        _this.setState({
          pendingSingleEnroll: null
        });
      });
    }
  },
  cancel: function cancel() {
    var onReject = this.props.onReject;
    this.handleCloseErrorAlert(POST_PROCESS_ERROR_ID);
    onReject();
  },
  trackEnrollButtonClick: function trackEnrollButtonClick() {
    var enrollType = this.props.enrollType;
    var action;

    if (enrollType === EnrollTypes.RESUME) {
      action = 'Resume a paused enrollment';
    } else if (enrollType === EnrollTypes.EDIT) {
      action = 'Updated an active enrollment';
    } else if (enrollType === EnrollTypes.REENROLL) {
      action = 'Reenrolled an unenrolled enrollment';
    }

    if (action) {
      UsageTracker.track('sequencesUsage', {
        action: action,
        subscreen: 'enroll'
      });
    }
  },
  getEnrollButton: function getEnrollButton(disabled) {
    var _this$props2 = this.props,
        enrollType = _this$props2.enrollType,
        hasMadeChanges = _this$props2.hasMadeChanges,
        isUploadingImage = _this$props2.isUploadingImage;

    var buttonText = /*#__PURE__*/_jsx(FormattedMessage, {
      message: "enrollModal.send"
    });

    if (enrollType === EnrollTypes.RESUME) {
      buttonText = /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.resume"
      });
    } else if (enrollType === EnrollTypes.EDIT) {
      buttonText = /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.save"
      });
    } else if (enrollType === EnrollTypes.REENROLL) {
      buttonText = /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.reenroll"
      });
    }

    return /*#__PURE__*/_jsx(UIButton, {
      use: "primary",
      className: "sequence-enroll-footer-button",
      "data-selenium-test": "sequence-enroll-controls__save-btn",
      disabled: disabled || enrollType === EnrollTypes.EDIT && !hasMadeChanges || isUploadingImage,
      onClick: this.confirm,
      children: buttonText
    });
  },
  renderEnrollButton: function renderEnrollButton() {
    var _this$props3 = this.props,
        erroringSteps = _this$props3.erroringSteps,
        sequenceEnrollmentHasErrors = _this$props3.sequenceEnrollmentHasErrors;

    if (sequenceEnrollmentHasErrors) {
      var tooltipKey = getEnrollButtonError(erroringSteps);
      var tooltipTitle = tooltipKey === 'sendLimit_jsx' ? /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: "enrollModal.confirmButtonDisabled." + tooltipKey,
        options: {
          href: sendLimitLearnMore()
        },
        elements: {
          Link: UILink
        }
      }) : /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.confirmButtonDisabled." + tooltipKey
      });
      return /*#__PURE__*/_jsx(UITooltip, {
        placement: "top right",
        title: tooltipTitle,
        children: this.getEnrollButton(true)
      });
    }

    return this.getEnrollButton();
  },
  renderEmailLimitInformation: function renderEmailLimitInformation() {
    var _this$props4 = this.props,
        stepsWithSendTimeErrors = _this$props4.stepsWithSendTimeErrors,
        isFirstStepWithCloseToSendLimitWarningToday = _this$props4.isFirstStepWithCloseToSendLimitWarningToday,
        sequenceEnrollment = _this$props4.sequenceEnrollment;

    if (stepsWithSendTimeErrors.size || isFirstStepWithCloseToSendLimitWarningToday) {
      return /*#__PURE__*/_jsx(UIFlex, {
        justify: "end",
        className: "p-left-3",
        children: /*#__PURE__*/_jsx(SendTimeAlertContainer, {
          stepsWithSendTimeErrors: stepsWithSendTimeErrors,
          timezone: sequenceEnrollment.timezone
        })
      });
    } else if (isFirstEditableStepEmail(sequenceEnrollment)) {
      return /*#__PURE__*/_jsx(UIFlex, {
        justify: "end",
        className: "p-left-3 p-right-2",
        children: /*#__PURE__*/_jsx(DailyEmailLimit, {
          timezone: sequenceEnrollment.timezone
        })
      });
    }

    return null;
  },
  render: function render() {
    return /*#__PURE__*/_jsxs("footer", {
      className: "sequence-enroll-modal-footer",
      children: [this.renderEnrollButton(), /*#__PURE__*/_jsx(UIButton, {
        use: "secondary",
        className: "m-right-5 sequence-enroll-footer-button",
        onClick: this.cancel,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.cancel"
        })
      }), /*#__PURE__*/_jsx(EnrollmentSenderAndRecipientInfo, {
        email: this.props.email
      }), /*#__PURE__*/_jsx("div", {
        className: "sequence-enroll-footer-email-limit-information",
        children: this.renderEmailLimitInformation()
      })]
    });
  }
});