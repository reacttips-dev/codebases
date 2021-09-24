'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import { Map as ImmutableMap, Iterable } from 'immutable';
import Checker from 'sales-modal/lib/Checker';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import SenderRecord from 'sales-modal/data/SenderRecord';
import * as EnrollmentEditorActions from 'sales-modal/redux/actions/EnrollmentEditorActions';
import createEnrollmentModal from 'sales-modal/initializers/createEnrollmentModal';
import createEnrollmentEditor from 'sales-modal/initializers/createEnrollmentEditor';
import EnrollmentStateInitializer from 'sales-modal/initializers/EnrollmentStateInitializer';
import BulkEnrollmentEditor from 'sales-modal/components/bulkEnroll/BulkEnrollmentEditor';
import IneligibleContactsPage from 'sales-modal/components/bulkEnroll/IneligibleContactsPage';
import BulkEnrollTour from 'sales-modal/components/bulkEnroll/shepherdTour/bulkEnrollTour';
import BulkEnrollLoading from 'sales-modal/components/bulkEnroll/BulkEnrollLoading';
import EnrollmentInboxConnectedError from 'sales-modal/components/enrollModal/EnrollmentInboxConnectedError';
import SharedInboxError from 'sales-modal/components/enrollModal/SharedInboxError';
import EnrollmentEditorInitializationError from 'sales-modal/components/enrollModal/EnrollmentEditorInitializationError';
import EnrollmentsDisabled from 'sales-modal/components/enrollModal/EnrollmentsDisabled';
import EnrollmentReaganTimeoutError from 'sales-modal/components/enrollModal/EnrollmentReaganTimeoutError';
import EnrollmentInitializationError from 'sales-modal/components/enrollModal/EnrollmentInitializationError';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
var EnrollmentEditor = createEnrollmentEditor({
  LoadingState: BulkEnrollLoading,
  UpsellState: function UpsellState() {
    return null;
  },
  ErrorState: EnrollmentEditorInitializationError,
  EditorComponent: BulkEnrollmentEditor
});
var SequenceBulkEnrollContainer = createReactClass({
  displayName: "SequenceBulkEnrollContainer",
  propTypes: {
    disableEnrollments: PropTypes.bool.isRequired,
    selectedSender: PropTypes.instanceOf(SenderRecord),
    connectedAccountIsLoading: PropTypes.bool.isRequired,
    connectedAccountIsValid: PropTypes.bool.isRequired,
    connectedAccountsError: PropTypes.bool.isRequired,
    reaganTimedOut: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    portalTimezone: PropTypes.string,
    decks: PropTypes.instanceOf(ImmutableMap),
    signature: PropTypes.string,
    sequence: PropTypes.instanceOf(ImmutableMap),
    sequenceError: PropTypes.bool.isRequired,
    contacts: PropTypes.instanceOf(ImmutableMap),
    ineligibleContacts: PropTypes.instanceOf(Iterable),
    selectedContact: PropTypes.string,
    sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord),
    enrollmentStateError: PropTypes.bool.isRequired,
    enrollSequence: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    initEnrollment: PropTypes.func.isRequired,
    enrollSingleContact: PropTypes.func.isRequired,
    removeContacts: PropTypes.func.isRequired,
    enrollmentError: PropTypes.bool,
    enrollMultipleContacts: PropTypes.func.isRequired
  },
  handleEnrollContact: function handleEnrollContact() {
    var _this$props = this.props,
        selectedContact = _this$props.selectedContact,
        enrollSequence = _this$props.enrollSequence,
        enrollSingleContact = _this$props.enrollSingleContact,
        sequenceEnrollment = _this$props.sequenceEnrollment,
        onConfirm = _this$props.onConfirm,
        contacts = _this$props.contacts;
    return enrollSingleContact({
      selectedContact: selectedContact,
      enrollSequence: enrollSequence,
      contact: contacts.get(selectedContact),
      sequenceEnrollment: sequenceEnrollment,
      onConfirm: onConfirm
    });
  },
  renderErrorState: function renderErrorState() {
    var _this$props2 = this.props,
        connectedAccountIsLoading = _this$props2.connectedAccountIsLoading,
        connectedAccountIsValid = _this$props2.connectedAccountIsValid,
        connectedAccountsError = _this$props2.connectedAccountsError,
        contacts = _this$props2.contacts,
        disableEnrollments = _this$props2.disableEnrollments,
        enrollmentStateError = _this$props2.enrollmentStateError,
        ineligibleContacts = _this$props2.ineligibleContacts,
        onReject = _this$props2.onReject,
        reaganTimedOut = _this$props2.reaganTimedOut,
        removeContacts = _this$props2.removeContacts,
        selectedSender = _this$props2.selectedSender,
        sequence = _this$props2.sequence,
        sequenceError = _this$props2.sequenceError;

    if (disableEnrollments) {
      return /*#__PURE__*/_jsx(EnrollmentsDisabled, {
        onReject: onReject
      });
    }

    if (reaganTimedOut) {
      return /*#__PURE__*/_jsx(EnrollmentReaganTimeoutError, {});
    }

    if (connectedAccountsError || sequenceError || enrollmentStateError) {
      return /*#__PURE__*/_jsx(EnrollmentInitializationError, {
        connectedAccountsError: connectedAccountsError,
        enrollmentStateError: enrollmentStateError,
        sequenceError: sequenceError
      });
    }

    if (!ineligibleContacts || connectedAccountIsLoading || !sequence || !contacts.size) {
      return /*#__PURE__*/_jsx(BulkEnrollLoading, {});
    }

    if (!connectedAccountIsValid) {
      return /*#__PURE__*/_jsx(EnrollmentInboxConnectedError, {});
    }

    var connectedAccount = selectedSender.connectedAccount,
        inboxAddress = selectedSender.inboxAddress;

    if (connectedAccount.isShared()) {
      return /*#__PURE__*/_jsx(SharedInboxError, {
        inboxAddress: inboxAddress
      });
    }

    if (ineligibleContacts.size) {
      return /*#__PURE__*/_jsx(IneligibleContactsPage, {
        contacts: contacts,
        ineligibleContacts: ineligibleContacts,
        removeContacts: removeContacts,
        onReject: onReject
      });
    }

    return null;
  },
  render: function render() {
    var _this$props3 = this.props,
        contacts = _this$props3.contacts,
        decks = _this$props3.decks,
        enrollmentError = _this$props3.enrollmentError,
        sequenceEnrollment = _this$props3.sequenceEnrollment,
        enrollMultipleContacts = _this$props3.enrollMultipleContacts,
        initEnrollment = _this$props3.initEnrollment,
        onConfirm = _this$props3.onConfirm,
        onReject = _this$props3.onReject,
        portalTimezone = _this$props3.portalTimezone,
        selectedSender = _this$props3.selectedSender,
        sequence = _this$props3.sequence,
        signature = _this$props3.signature,
        user = _this$props3.user,
        selectedContact = _this$props3.selectedContact;
    var errorState = this.renderErrorState();

    if (errorState) {
      return /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
          onClick: onReject
        }), errorState]
      });
    }

    var connectedAccount = selectedSender.connectedAccount;
    var inboxType = connectedAccount.integration.type;
    return /*#__PURE__*/_jsx(EnrollmentEditor, {
      hasEnrolledSequence: false,
      isWithinSalesModal: false,
      user: user,
      portalTimezone: portalTimezone,
      inboxType: inboxType,
      signature: signature,
      sequence: sequence,
      decks: decks,
      selectedSender: selectedSender,
      connectedAccount: connectedAccount,
      sequenceEnrollment: sequenceEnrollment,
      onReject: onReject,
      initEnrollment: initEnrollment,
      limitReachedProps: {
        cancel: onReject
      },
      onConfirm: onConfirm,
      contacts: contacts,
      enrollmentError: enrollmentError,
      enrollSingleContact: this.handleEnrollContact,
      enrollMultipleContacts: enrollMultipleContacts,
      selectedContact: selectedContact
    });
  }
});
var successSelectors = ['.ineligible-contacts-page', '.sequence-enrollment-editor', '.enrollments-disabled', '.connected-inbox-error', '.shared-inbox-error', '.enrollment-cannot-proceed'];
var errorSelectors = ['.enrollment-editor-loading-error', '.enrollment-error-enrollment-state', '.enrollment-error-connected-accounts', '.enrollment-error-sequence-fetch', '.enroll-reagan-timeout-error'];
var CheckedSequenceBulkEnrollContainer = Checker({
  selectorName: 'sequence-bulk-enrollment-container',
  successSelectors: successSelectors.join(', '),
  errorSelectors: errorSelectors.join(', ')
})(SequenceBulkEnrollContainer);
var SequenceBulkEnrollContainerWithBulkEnrollTour = BulkEnrollTour(CheckedSequenceBulkEnrollContainer);
export default createEnrollmentModal(SequenceBulkEnrollContainerWithBulkEnrollTour, EnrollmentStateInitializer, EnrollmentEditorActions.initBulkEnrollment);