'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import { Map as ImmutableMap } from 'immutable';
import formatName from 'I18n/utils/formatName';
import { connect } from 'react-redux';
import { PRIMARY_SEQUENCE_ID, POST_PROCESS_ERROR_ID } from 'sales-modal/constants/BulkEnrollConstants';
import { getSequenceName as getSequenceNameSelector, getReadySequenceEnrollments as getReadySequenceEnrollmentsSelector, getSequenceHasPrivateTemplates as getSequenceHasPrivateTemplatesSelector, getStepsWithSendTimeErrors as getStepsWithSendTimeErrorsSelector, getSelectedSequenceEnrollmentTokenErrors as getSelectedSequenceEnrollmentTokenErrorsSelector, getIsFirstStepWithCloseToSendLimitWarningToday as getIsFirstStepWithCloseToSendLimitWarningTodaySelector, getSequenceEnrollmentIsUploadingImage } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import * as EnrollmentStateActions from 'sales-modal/redux/actions/EnrollmentStateActions';
import { sendLimitLearnMore } from 'sales-modal/lib/links';
import SelectConnectedAccount from 'sales-modal/components/enrollModal/SelectConnectedAccount';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import ReviewModal from 'sales-modal/components/bulkEnroll/ReviewModal';
import SendTimeAlertContainer from 'sales-modal/components/enrollModal/SendTimeAlertContainer';
import DailyEmailLimit from 'sales-modal/components/enrollModal/DailyEmailLimit';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';
import UIBreakString from 'UIComponents/text/UIBreakString';
import UILink from 'UIComponents/link/UILink';
import SalesModalAlertsStore from 'sales-modal/utils/SalesModalAlertsStore';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import isFirstEditableStepEmail from 'sales-modal/utils/enrollModal/isFirstEditableStepEmail';
var BULK_ENROLL = 'BULK_ENROLL';
var SINGLE_ENROLL = 'SINGLE_ENROLL';
var BulkEnrollmentFooter = createReactClass({
  displayName: "BulkEnrollmentFooter",
  propTypes: {
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    unenrolledContacts: PropTypes.instanceOf(ImmutableMap).isRequired,
    enrollSingleContact: PropTypes.func.isRequired,
    enrollMultipleContacts: PropTypes.func.isRequired,
    selectedContact: PropTypes.string,
    sequenceName: PropTypes.string,
    bulkEnrollContacts: PropTypes.func.isRequired,
    readySequenceEnrollments: PropTypes.instanceOf(ImmutableMap).isRequired,
    sequenceHasPrivateTemplates: PropTypes.bool.isRequired,
    stepsWithSendTimeErrors: PropTypes.instanceOf(ImmutableMap).isRequired,
    selectedSequenceEnrollmentTokenErrors: PropTypes.number,
    sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord).isRequired,
    isFirstStepWithCloseToSendLimitWarningToday: PropTypes.bool.isRequired,
    isUploadingImage: PropTypes.bool.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      showCancelConfirmModal: false,
      showSingleEnrollConfirmModal: false,
      showBulkEnrollConfirmModal: false
    };
  },
  handleBulkEnrollContacts: function handleBulkEnrollContacts() {
    var _this$props = this.props,
        onConfirm = _this$props.onConfirm,
        bulkEnrollContacts = _this$props.bulkEnrollContacts,
        readySequenceEnrollments = _this$props.readySequenceEnrollments,
        enrollMultipleContacts = _this$props.enrollMultipleContacts;
    this.handleCloseErrorAlert(POST_PROCESS_ERROR_ID);
    return bulkEnrollContacts({
      sequenceEnrollments: readySequenceEnrollments,
      enrollMultipleContacts: enrollMultipleContacts,
      onConfirm: onConfirm
    }).catch(function () {
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
    });
  },
  handleEnrollSingleContact: function handleEnrollSingleContact() {
    this.handleCloseErrorAlert(POST_PROCESS_ERROR_ID);
    this.props.enrollSingleContact().catch(function () {
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
    });
  },
  handleCloseErrorAlert: function handleCloseErrorAlert(error) {
    if (SalesModalAlertsStore.getAlerts()[error]) {
      SalesModalAlertsStore.removeAlert(error);
    }
  },
  getEnrollButtonTooltipComponent: function getEnrollButtonTooltipComponent(enrollType) {
    var _this$props2 = this.props,
        readySequenceEnrollments = _this$props2.readySequenceEnrollments,
        stepsWithSendTimeErrors = _this$props2.stepsWithSendTimeErrors,
        sequenceHasPrivateTemplates = _this$props2.sequenceHasPrivateTemplates,
        selectedSequenceEnrollmentTokenErrors = _this$props2.selectedSequenceEnrollmentTokenErrors,
        unenrolledContacts = _this$props2.unenrolledContacts;
    var baseMessage = 'enrollModal.confirmButtonDisabled.bulkEnroll';

    if (sequenceHasPrivateTemplates) {
      return /*#__PURE__*/_jsx(FormattedMessage, {
        message: baseMessage + ".privateTemplate"
      });
    }

    if (stepsWithSendTimeErrors.size) {
      return /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: baseMessage + ".sendLimit_jsx",
        options: {
          href: sendLimitLearnMore(),
          count: stepsWithSendTimeErrors.size
        },
        elements: {
          Link: UILink
        }
      });
    }

    if (enrollType === BULK_ENROLL && readySequenceEnrollments.size === 0) {
      return /*#__PURE__*/_jsx(FormattedMessage, {
        message: baseMessage + ".mergeTags"
      });
    }

    if (enrollType === SINGLE_ENROLL && selectedSequenceEnrollmentTokenErrors) {
      return /*#__PURE__*/_jsx(FormattedMessage, {
        message: baseMessage + ".mergeTagsSingleEnroll"
      });
    }

    var numberOfSequenceEnrollmentsWithTokenErrors = unenrolledContacts.size - readySequenceEnrollments.size;

    if (enrollType === BULK_ENROLL && numberOfSequenceEnrollmentsWithTokenErrors > 0) {
      return /*#__PURE__*/_jsx(FormattedMessage, {
        message: "bulkEnroll.footer.bulkEnrollButtonTokenTooltip",
        options: {
          count: numberOfSequenceEnrollmentsWithTokenErrors
        }
      });
    }

    return null;
  },
  getBulkEnrollButton: function getBulkEnrollButton(disabled) {
    var _this = this;

    var _this$props3 = this.props,
        readySequenceEnrollments = _this$props3.readySequenceEnrollments,
        unenrolledContacts = _this$props3.unenrolledContacts;

    var buttonText = /*#__PURE__*/_jsx(FormattedMessage, {
      message: "bulkEnroll.footer.bulkEnrollButton",
      options: {
        eligibleContacts: readySequenceEnrollments.size,
        contactsSelected: unenrolledContacts.size
      }
    });

    return /*#__PURE__*/_jsx(UIButton, {
      use: "primary",
      disabled: disabled,
      onClick: function onClick() {
        return _this.setState({
          showBulkEnrollConfirmModal: true
        });
      },
      "data-selenium-test": "sequence-bulk-enroll-button",
      children: buttonText
    });
  },
  confirmModalClose: function confirmModalClose() {
    this.setState({
      showCancelConfirmModal: true
    });
    this.handleCloseErrorAlert(POST_PROCESS_ERROR_ID);
  },
  renderCancelConfirmModal: function renderCancelConfirmModal() {
    var _this2 = this;

    var unenrolledContacts = this.props.unenrolledContacts;
    return /*#__PURE__*/_jsx(UIConfirmModal, {
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "bulkEnroll.footer.cancelModalTitle"
      }),
      description: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "bulkEnroll.footer.cancelModalBody",
        options: {
          count: unenrolledContacts.size
        }
      }),
      confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "bulkEnroll.footer.cancelModalConfirm"
      }),
      onConfirm: this.props.onReject,
      rejectLabel: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "bulkEnroll.footer.cancelModalReject"
      }),
      onReject: function onReject() {
        return _this2.setState({
          showCancelConfirmModal: false
        });
      }
    });
  },
  renderSingleEnrollConfirmModal: function renderSingleEnrollConfirmModal() {
    var _this3 = this;

    var _this$props4 = this.props,
        unenrolledContacts = _this$props4.unenrolledContacts,
        selectedContact = _this$props4.selectedContact,
        sequenceName = _this$props4.sequenceName;
    var contact = unenrolledContacts.get(selectedContact);
    var contactName = formatName({
      firstName: getProperty(contact, 'firstname'),
      lastName: getProperty(contact, 'lastname'),
      email: getProperty(contact, 'email')
    });
    return /*#__PURE__*/_jsx(UIConfirmModal, {
      "data-selenium-test": "sequence-bulk-enroll-single-confirm-dialog",
      message: /*#__PURE__*/_jsx(UIBreakString, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "bulkEnroll.footer.singleEnrollmentModalTitle",
          options: {
            contactName: contactName,
            sequenceName: sequenceName
          }
        })
      }),
      description: "",
      confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "bulkEnroll.footer.singleEnrollmentModalConfirm"
      }),
      confirmButtonProps: {
        truncate: true
      },
      onConfirm: function onConfirm() {
        _this3.setState({
          showSingleEnrollConfirmModal: false
        });

        _this3.handleEnrollSingleContact();
      },
      rejectLabel: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "bulkEnroll.footer.singleEnrollmentModalReject"
      }),
      onReject: function onReject() {
        return _this3.setState({
          showSingleEnrollConfirmModal: false
        });
      }
    });
  },
  renderBulkEnrollConfirmModal: function renderBulkEnrollConfirmModal() {
    var _this4 = this;

    var _this$props5 = this.props,
        readySequenceEnrollments = _this$props5.readySequenceEnrollments,
        sequenceName = _this$props5.sequenceName;
    return /*#__PURE__*/_jsx(ReviewModal, {
      onConfirm: function onConfirm() {
        _this4.setState({
          showBulkEnrollConfirmModal: false
        });
      },
      onReject: function onReject() {
        return _this4.setState({
          showBulkEnrollConfirmModal: false
        });
      },
      handleBulkEnrollContacts: this.handleBulkEnrollContacts,
      sequenceName: sequenceName,
      numContacts: readySequenceEnrollments.size
    });
  },
  renderBulkEnrollButton: function renderBulkEnrollButton() {
    var _this$props6 = this.props,
        readySequenceEnrollments = _this$props6.readySequenceEnrollments,
        stepsWithSendTimeErrors = _this$props6.stepsWithSendTimeErrors,
        sequenceHasPrivateTemplates = _this$props6.sequenceHasPrivateTemplates,
        isUploadingImage = _this$props6.isUploadingImage;
    var maybeTooltip = this.getEnrollButtonTooltipComponent(BULK_ENROLL);
    var buttonShouldBeDisabled = !readySequenceEnrollments.size || stepsWithSendTimeErrors.size || sequenceHasPrivateTemplates || isUploadingImage;

    if (maybeTooltip) {
      return /*#__PURE__*/_jsx(UITooltip, {
        title: maybeTooltip,
        maxWidth: 200,
        children: this.getBulkEnrollButton(!!buttonShouldBeDisabled)
      });
    }

    return this.getBulkEnrollButton(!!buttonShouldBeDisabled);
  },
  renderSingleEnrollButton: function renderSingleEnrollButton() {
    var _this5 = this;

    var _this$props7 = this.props,
        isUploadingImage = _this$props7.isUploadingImage,
        unenrolledContacts = _this$props7.unenrolledContacts,
        selectedContact = _this$props7.selectedContact;
    var contact = unenrolledContacts.get(selectedContact);
    var contactName = formatName({
      firstName: getProperty(contact, 'firstname'),
      email: getProperty(contact, 'email')
    });
    var maybeTooltip = this.getEnrollButtonTooltipComponent(SINGLE_ENROLL);
    var cannotBeEnrolled = !!maybeTooltip || isUploadingImage;
    return /*#__PURE__*/_jsx(UITooltip, {
      title: maybeTooltip,
      disabled: !maybeTooltip,
      children: /*#__PURE__*/_jsx(UIButton, {
        "data-selenium-test": "sequence-bulk-enroll-single-enroll-button",
        className: "m-right-2",
        use: "secondary",
        onClick: function onClick() {
          return _this5.setState({
            showSingleEnrollConfirmModal: true
          });
        },
        disabled: cannotBeEnrolled,
        truncate: true,
        truncateStringProps: {
          tooltip: !cannotBeEnrolled
        },
        style: {
          maxWidth: '500px'
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "bulkEnroll.footer.singleEnrollButton",
          options: {
            contactName: contactName
          }
        })
      })
    });
  },
  renderEnrollButtons: function renderEnrollButtons() {
    var selectedContact = this.props.selectedContact;
    var contactIsSelected = selectedContact && selectedContact !== PRIMARY_SEQUENCE_ID;
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [contactIsSelected && this.renderSingleEnrollButton(), this.renderBulkEnrollButton()]
    });
  },
  renderEmailLimitInformation: function renderEmailLimitInformation() {
    var _this$props8 = this.props,
        stepsWithSendTimeErrors = _this$props8.stepsWithSendTimeErrors,
        isFirstStepWithCloseToSendLimitWarningToday = _this$props8.isFirstStepWithCloseToSendLimitWarningToday,
        sequenceEnrollment = _this$props8.sequenceEnrollment;
    var timezone = sequenceEnrollment.get('timezone');

    if (stepsWithSendTimeErrors.size || isFirstStepWithCloseToSendLimitWarningToday) {
      return /*#__PURE__*/_jsx(SendTimeAlertContainer, {
        className: "p-right-5",
        stepsWithSendTimeErrors: stepsWithSendTimeErrors,
        timezone: timezone
      });
    } else if (isFirstEditableStepEmail(sequenceEnrollment)) {
      return /*#__PURE__*/_jsx(DailyEmailLimit, {
        textClassName: "p-right-6 p-left-4",
        timezone: timezone
      });
    }

    return null;
  },
  renderFromEmailSelect: function renderFromEmailSelect() {
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx("strong", {
        className: "p-all-0 p-right-2",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.from"
        })
      }), /*#__PURE__*/_jsx(SelectConnectedAccount, {})]
    });
  },
  render: function render() {
    var _this$state = this.state,
        showCancelConfirmModal = _this$state.showCancelConfirmModal,
        showSingleEnrollConfirmModal = _this$state.showSingleEnrollConfirmModal,
        showBulkEnrollConfirmModal = _this$state.showBulkEnrollConfirmModal;
    return /*#__PURE__*/_jsxs("div", {
      className: "sequence-enroll-modal-footer justify-between",
      children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: this.confirmModalClose
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex-order-1",
        children: [this.renderFromEmailSelect(), this.renderEmailLimitInformation(), this.renderEnrollButtons()]
      }), /*#__PURE__*/_jsx(UIButton, {
        className: "m-right-5",
        onClick: this.confirmModalClose,
        use: "transparent",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.cancel"
        })
      }), showCancelConfirmModal && this.renderCancelConfirmModal(), showSingleEnrollConfirmModal && this.renderSingleEnrollConfirmModal(), showBulkEnrollConfirmModal && this.renderBulkEnrollConfirmModal()]
    });
  }
});
export default connect(function (state) {
  return {
    sequenceName: getSequenceNameSelector(state),
    readySequenceEnrollments: getReadySequenceEnrollmentsSelector(state),
    sequenceHasPrivateTemplates: getSequenceHasPrivateTemplatesSelector(state),
    stepsWithSendTimeErrors: getStepsWithSendTimeErrorsSelector(state),
    selectedSequenceEnrollmentTokenErrors: getSelectedSequenceEnrollmentTokenErrorsSelector(state),
    isFirstStepWithCloseToSendLimitWarningToday: getIsFirstStepWithCloseToSendLimitWarningTodaySelector(state),
    isUploadingImage: getSequenceEnrollmentIsUploadingImage(state)
  };
}, {
  bulkEnrollContacts: EnrollmentStateActions.bulkEnrollContacts
})(BulkEnrollmentFooter);