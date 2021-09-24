'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap, List } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import I18n from 'I18n';
import { hasSequencesAccess as hasSequencesAccessSelector } from 'sales-modal/redux/selectors/permissionSelectors';
import { getPlatform as getPlatformSelector } from 'sales-modal/redux/selectors/SenderSelectors';
import { getSelectedSequenceEnrollmentRecordHasBeenEdited, getSelectedContactEligibility } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import { STARTED, ENROLLMENT_INIT_FETCH } from 'sales-modal/constants/RequestStatusTypes';
import { CONTACT_MISSING_EMAIL } from 'sales-modal/constants/EnrollmentEditorEnrollmentErrors';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import SenderRecord from 'sales-modal/data/SenderRecord';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import { EnrollTypePropType } from 'sales-modal/constants/EnrollTypes';
import { PlatformPropType } from 'sales-modal/constants/Platform';
import _cannotEnrollContactInSequence from 'sales-modal/utils/enrollModal/cannotEnrollContactInSequence';
import getIneligibleContactReason from 'sales-modal/utils/enrollModal/getIneligibleContactReason';
import EnrollmentEditorInitializationError from 'sales-modal/components/enrollModal/EnrollmentEditorInitializationError';
import CannotEnrollSequence from 'sales-modal/components/enrollModal/CannotEnrollSequence';
export default (function (_ref) {
  var LoadingState = _ref.LoadingState,
      UpsellState = _ref.UpsellState,
      EditorComponent = _ref.EditorComponent;
  var EnrollmentEditorWrapper = createReactClass({
    displayName: 'EnrollmentEditorWrapper',
    propTypes: {
      vid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord),
      sequence: PropTypes.instanceOf(ImmutableMap),
      stepEnrollments: PropTypes.instanceOf(List),
      hasEnrolledSequence: PropTypes.bool.isRequired,
      signature: PropTypes.string,
      selectedContact: PropTypes.string,
      selectedSender: PropTypes.instanceOf(SenderRecord),
      isWithinSalesModal: PropTypes.bool,
      user: PropTypes.object,
      portalTimezone: PropTypes.string,
      cannotEnrollContactProps: PropTypes.object,
      initEnrollment: PropTypes.func.isRequired,
      decks: PropTypes.instanceOf(ImmutableMap),
      onConfirm: PropTypes.func,
      onReject: PropTypes.func.isRequired,
      goBackToSequences: PropTypes.func,
      hasSequencesAccess: PropTypes.bool.isRequired,
      sequenceEnrollmentHasBeenEdited: PropTypes.bool.isRequired,
      platform: PlatformPropType.isRequired,
      requestStatus: PropTypes.object.isRequired,
      enrollmentError: PropTypes.object,
      enrollSingleContact: PropTypes.func,
      enrollMultipleContacts: PropTypes.func,
      enrollmentState: PropTypes.string,
      enrollType: EnrollTypePropType,
      eligibility: PropTypes.instanceOf(ImmutableMap),
      contacts: PropTypes.instanceOf(ImmutableMap)
    },
    componentDidMount: function componentDidMount() {
      this.initEnrollment();
      window.addEventListener('beforeunload', this.handleWindowBeforeUnload);
    },
    componentWillUnmount: function componentWillUnmount() {
      window.removeEventListener('beforeunload', this.handleWindowBeforeUnload);
    },
    isEnrollmentLoading: function isEnrollmentLoading() {
      return !this.props.requestStatus.get(ENROLLMENT_INIT_FETCH) || this.props.requestStatus.get(ENROLLMENT_INIT_FETCH) === STARTED;
    },
    handleWindowBeforeUnload: function handleWindowBeforeUnload(e) {
      var sequenceEnrollmentHasBeenEdited = this.props.sequenceEnrollmentHasBeenEdited;

      if (sequenceEnrollmentHasBeenEdited) {
        e.preventDefault();
        var message = I18n.text('enrollmentEditor.notSaved');
        e.returnValue = message;
        return message;
      }

      return undefined;
    },
    initEnrollment: function initEnrollment() {
      var _this$props = this.props,
          vid = _this$props.vid,
          sequence = _this$props.sequence,
          signature = _this$props.signature,
          selectedContact = _this$props.selectedContact,
          selectedSender = _this$props.selectedSender,
          portalTimezone = _this$props.portalTimezone,
          hasEnrolledSequence = _this$props.hasEnrolledSequence,
          stepEnrollments = _this$props.stepEnrollments,
          enrollmentState = _this$props.enrollmentState;
      this.props.initEnrollment({
        vid: vid,
        signature: signature,
        portalTimezone: portalTimezone,
        sequence: sequence,
        selectedSender: selectedSender,
        hasEnrolledSequence: hasEnrolledSequence,
        stepEnrollments: stepEnrollments,
        recipientEmail: selectedContact,
        enrollmentState: enrollmentState
      });
    },
    cannotEnrollContactInSequence: function cannotEnrollContactInSequence() {
      var _this$props2 = this.props,
          stepEnrollments = _this$props2.stepEnrollments,
          eligibility = _this$props2.eligibility;
      return _cannotEnrollContactInSequence({
        stepEnrollments: stepEnrollments,
        eligibility: eligibility
      });
    },
    renderCannotEnrollContact: function renderCannotEnrollContact() {
      var _this$props3 = this.props,
          cannotEnrollContactProps = _this$props3.cannotEnrollContactProps,
          eligibility = _this$props3.eligibility,
          selectedContact = _this$props3.selectedContact,
          contacts = _this$props3.contacts;
      var contact = contacts.get(selectedContact);
      var cannotEnrollReason = getIneligibleContactReason({
        contact: contact,
        eligibility: eligibility
      });
      return /*#__PURE__*/_jsx(CannotEnrollSequence, Object.assign({
        contact: contact,
        reason: cannotEnrollReason
      }, cannotEnrollContactProps));
    },
    render: function render() {
      var _this$props4 = this.props,
          sequenceEnrollment = _this$props4.sequenceEnrollment,
          decks = _this$props4.decks,
          selectedSender = _this$props4.selectedSender,
          isWithinSalesModal = _this$props4.isWithinSalesModal,
          user = _this$props4.user,
          onConfirm = _this$props4.onConfirm,
          onReject = _this$props4.onReject,
          goBackToSequences = _this$props4.goBackToSequences,
          hasSequencesAccess = _this$props4.hasSequencesAccess,
          platform = _this$props4.platform,
          enrollmentError = _this$props4.enrollmentError,
          enrollSingleContact = _this$props4.enrollSingleContact,
          enrollMultipleContacts = _this$props4.enrollMultipleContacts,
          portalTimezone = _this$props4.portalTimezone,
          selectedContact = _this$props4.selectedContact,
          contacts = _this$props4.contacts;

      if (enrollmentError) {
        return enrollmentError.enrollmentEditorEnrollmentError === CONTACT_MISSING_EMAIL ? this.renderCannotEnrollContact() : /*#__PURE__*/_jsx(EnrollmentEditorInitializationError, {
          initEnrollment: this.initEnrollment
        });
      }

      if (this.isEnrollmentLoading() || !sequenceEnrollment) {
        return /*#__PURE__*/_jsx(LoadingState, {});
      }

      if (!hasSequencesAccess) {
        return /*#__PURE__*/_jsx(UpsellState, {});
      }

      if (this.cannotEnrollContactInSequence()) {
        return this.renderCannotEnrollContact();
      }

      var contact = contacts.get(selectedContact);
      return /*#__PURE__*/_jsx(EditorComponent, {
        sequenceEnrollment: sequenceEnrollment,
        contact: contact,
        email: getProperty(contact, 'email'),
        decks: decks,
        connectedAccount: selectedSender.connectedAccount,
        isWithinSalesModal: isWithinSalesModal,
        user: user,
        onConfirm: onConfirm,
        onReject: onReject,
        goBackToSequences: goBackToSequences,
        platform: platform,
        enrollSingleContact: enrollSingleContact,
        enrollMultipleContacts: enrollMultipleContacts,
        portalTimezone: portalTimezone
      });
    }
  });
  return connect(function (state) {
    return {
      hasSequencesAccess: hasSequencesAccessSelector(state),
      platform: getPlatformSelector(state),
      sequenceEnrollmentHasBeenEdited: getSelectedSequenceEnrollmentRecordHasBeenEdited(state),
      requestStatus: state.enrollmentState.requestStatus,
      enrollType: state.enrollType,
      eligibility: getSelectedContactEligibility(state)
    };
  })(EnrollmentEditorWrapper);
});