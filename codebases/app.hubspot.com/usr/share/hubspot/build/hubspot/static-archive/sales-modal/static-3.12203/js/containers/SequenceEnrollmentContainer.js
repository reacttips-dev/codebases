/* eslint-disable consistent-return */
'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Map as ImmutableMap, List } from 'immutable';
import Checker from 'sales-modal/lib/Checker';
import SenderRecord from 'sales-modal/data/SenderRecord';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import * as EnrollmentEditorActions from 'sales-modal/redux/actions/EnrollmentEditorActions';
import createEnrollmentEditor from 'sales-modal/initializers/createEnrollmentEditor';
import createEnrollmentModal from 'sales-modal/initializers/createEnrollmentModal';
import EnrollModalLoading from 'sales-modal/components/enrollModal/EnrollModalLoading';
import SequencesUpsell from 'sales-modal/components/enrollModal/SequencesUpsell';
import EnrollmentReaganTimeoutError from 'sales-modal/components/enrollModal/EnrollmentReaganTimeoutError';
import EnrollmentsDisabled from 'sales-modal/components/enrollModal/EnrollmentsDisabled';
import EnrollmentInitializationError from 'sales-modal/components/enrollModal/EnrollmentInitializationError';
import EnrollmentInboxConnectedError from 'sales-modal/components/enrollModal/EnrollmentInboxConnectedError';
import SharedInboxError from 'sales-modal/components/enrollModal/SharedInboxError';
import EnrollmentStateInitializer from 'sales-modal/initializers/EnrollmentStateInitializer';
import EnrollmentEditorComponent from 'sales-modal/components/enrollModal/EnrollmentEditor';
import { EnrollTypePropType, EnrollTypes } from '../constants/EnrollTypes';
export var EnrollmentEditor = createEnrollmentEditor({
  LoadingState: EnrollModalLoading,
  UpsellState: SequencesUpsell,
  EditorComponent: EnrollmentEditorComponent
});
export var SequenceEnrollmentContainer = createReactClass({
  displayName: "SequenceEnrollmentContainer",
  propTypes: {
    disableEnrollments: PropTypes.bool.isRequired,
    selectedSender: PropTypes.instanceOf(SenderRecord),
    selectedContact: PropTypes.string,
    connectedAccountIsLoading: PropTypes.bool.isRequired,
    connectedAccountIsValid: PropTypes.bool.isRequired,
    connectedAccountsError: PropTypes.bool.isRequired,
    reaganTimedOut: PropTypes.bool.isRequired,
    portalTimezone: PropTypes.string,
    decks: PropTypes.instanceOf(ImmutableMap),
    enrolledSequence: PropTypes.instanceOf(ImmutableMap),
    sequence: PropTypes.instanceOf(ImmutableMap),
    sequenceError: PropTypes.bool.isRequired,
    stepEnrollments: PropTypes.instanceOf(List),
    signature: PropTypes.string,
    user: PropTypes.object,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    isWithinSalesModal: PropTypes.bool,
    goBackToSequences: function goBackToSequences(props) {
      if (props.isWithinSalesModal && !props.goBackToSequences) {
        return new Error('goBackToSequences is required when isWithinSalesModal is true');
      }
    },
    sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord),
    enrollmentStateError: PropTypes.bool.isRequired,
    initEnrollment: PropTypes.func.isRequired,
    enrollmentError: PropTypes.object,
    enrollmentState: PropTypes.string,
    contacts: PropTypes.instanceOf(ImmutableMap),
    enrollType: EnrollTypePropType.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      isWithinSalesModal: true,
      signature: ''
    };
  },
  renderEnrollModal: function renderEnrollModal() {
    var _this$props = this.props,
        user = _this$props.user,
        onConfirm = _this$props.onConfirm,
        decks = _this$props.decks,
        sequence = _this$props.sequence,
        stepEnrollments = _this$props.stepEnrollments,
        enrolledSequence = _this$props.enrolledSequence,
        selectedSender = _this$props.selectedSender,
        selectedContact = _this$props.selectedContact,
        onReject = _this$props.onReject,
        sequenceEnrollment = _this$props.sequenceEnrollment,
        signature = _this$props.signature,
        isWithinSalesModal = _this$props.isWithinSalesModal,
        portalTimezone = _this$props.portalTimezone,
        initEnrollment = _this$props.initEnrollment,
        goBackToSequences = _this$props.goBackToSequences,
        enrollmentError = _this$props.enrollmentError,
        enrollmentState = _this$props.enrollmentState,
        contacts = _this$props.contacts;
    return /*#__PURE__*/_jsx(EnrollmentEditor, {
      sequence: sequence,
      hasEnrolledSequence: !!enrolledSequence,
      stepEnrollments: stepEnrollments,
      decks: decks,
      selectedContact: selectedContact,
      selectedSender: selectedSender,
      user: user,
      onConfirm: onConfirm,
      cannotEnrollContactProps: {
        onReject: onReject
      },
      limitReachedProps: {
        cancel: onReject
      },
      onReject: onReject,
      sequenceEnrollment: sequenceEnrollment,
      signature: signature,
      isWithinSalesModal: isWithinSalesModal,
      portalTimezone: portalTimezone,
      initEnrollment: initEnrollment,
      goBackToSequences: goBackToSequences,
      enrollmentError: enrollmentError,
      enrollmentState: enrollmentState,
      contacts: contacts
    });
  },
  render: function render() {
    var _this$props2 = this.props,
        disableEnrollments = _this$props2.disableEnrollments,
        sequence = _this$props2.sequence,
        enrollmentStateError = _this$props2.enrollmentStateError,
        sequenceError = _this$props2.sequenceError,
        reaganTimedOut = _this$props2.reaganTimedOut,
        selectedSender = _this$props2.selectedSender,
        connectedAccountIsLoading = _this$props2.connectedAccountIsLoading,
        connectedAccountIsValid = _this$props2.connectedAccountIsValid,
        connectedAccountsError = _this$props2.connectedAccountsError,
        onReject = _this$props2.onReject,
        contacts = _this$props2.contacts,
        enrollType = _this$props2.enrollType;

    if (reaganTimedOut) {
      return /*#__PURE__*/_jsx(EnrollmentReaganTimeoutError, {});
    } // VIEW does not allow enrolling, so no need to check health status & connected accounts


    var needsEnrollCapability = enrollType !== EnrollTypes.VIEW;

    if (needsEnrollCapability) {
      if (disableEnrollments) {
        return /*#__PURE__*/_jsx(EnrollmentsDisabled, {
          onReject: onReject
        });
      }

      if (connectedAccountsError || sequenceError || enrollmentStateError) {
        return /*#__PURE__*/_jsx(EnrollmentInitializationError, {
          connectedAccountsError: connectedAccountsError,
          sequenceError: sequenceError,
          enrollmentStateError: enrollmentStateError
        });
      }

      if (connectedAccountIsLoading || !sequence || !contacts.size) {
        return /*#__PURE__*/_jsx(EnrollModalLoading, {});
      }

      if (!connectedAccountIsValid) {
        return /*#__PURE__*/_jsx(EnrollmentInboxConnectedError, {});
      }

      if (selectedSender.connectedAccount.isShared()) {
        return /*#__PURE__*/_jsx(SharedInboxError, {
          inboxAddress: selectedSender.inboxAddress
        });
      }
    }

    if (sequenceError || enrollmentStateError) {
      return /*#__PURE__*/_jsx(EnrollmentInitializationError, {
        connectedAccountsError: connectedAccountsError,
        sequenceError: sequenceError,
        enrollmentStateError: enrollmentStateError
      });
    }

    if (!sequence || !contacts.size) {
      return /*#__PURE__*/_jsx(EnrollModalLoading, {});
    }

    return this.renderEnrollModal();
  }
});
var successSelectors = ['.sequence-enrollment-editor', '.enrollments-disabled', '.shared-inbox-error', '.connected-inbox-error', '.sequences-upsell-state', '.enrollment-cannot-proceed'];
var errorSelectors = ['.enrollment-editor-loading-error', '.enrollment-error-enrollment-state', '.enrollment-error-connected-accounts', '.enrollment-error-sequence-fetch', '.enroll-reagan-timeout-error'];
var performanceSelectors = ['.sequence-step-editor-error', '.draft-template-editor-body', '.task-subject-editor', '.task-editor'];
var CheckedSequenceEnrollmentContainer = Checker({
  selectorName: 'sequence-enrollment-container',
  successSelectors: successSelectors.join(', '),
  errorSelectors: errorSelectors.join(', '),
  performanceSelectors: performanceSelectors.join(', ')
})(SequenceEnrollmentContainer);
export default createEnrollmentModal(CheckedSequenceEnrollmentContainer, EnrollmentStateInitializer, EnrollmentEditorActions.initEnrollment);