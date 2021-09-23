/* eslint-disable consistent-return */
'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Map as ImmutableMap, List } from 'immutable';
import { connect } from 'react-redux';
import { shouldDisableEnrollments } from 'sales-modal/redux/selectors/EnrollHealthStatusSelectors';
import SenderRecord from 'sales-modal/data/SenderRecord';
import * as ConnectedAccountsActions from 'sales-modal/redux/actions/ConnectedAccountsActions';
import * as DecksActions from 'sales-modal/redux/actions/DecksActions';
import * as SequenceActions from 'sales-modal/redux/actions/SequenceActions';
import * as EnrollHealthStatusActions from 'sales-modal/redux/actions/EnrollHealthStatusActions';
import * as PropertiesActions from 'sales-modal/redux/actions/PropertiesActions';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import { EnrollTypePropType } from '../constants/EnrollTypes';
import { enrollSequencePropTypeChecker } from '../utils/enrollModal/viewEnrollmentUtil';
export default (function (Container, editorInitializer, initEnrollmentAction) {
  var ContainerWithInitializedEditor = editorInitializer(Container);
  var EnrollmentModal = createReactClass({
    displayName: "EnrollmentModal",
    propTypes: {
      portalTimezone: PropTypes.string,
      selectedSender: PropTypes.instanceOf(SenderRecord),
      contacts: PropTypes.instanceOf(ImmutableMap),
      decks: PropTypes.instanceOf(ImmutableMap),
      signature: PropTypes.string,
      reaganTimedOut: PropTypes.bool,
      sequenceId: PropTypes.number,
      enrolledSequence: PropTypes.instanceOf(ImmutableMap),
      sequence: PropTypes.instanceOf(ImmutableMap),
      sequenceError: PropTypes.bool.isRequired,
      stepEnrollments: PropTypes.instanceOf(List),
      connectedAccountIsLoading: PropTypes.bool.isRequired,
      connectedAccountsError: PropTypes.bool.isRequired,
      user: PropTypes.object,
      onConfirm: PropTypes.func.isRequired,
      onReject: PropTypes.func.isRequired,
      isWithinSalesModal: PropTypes.bool,
      initConnectedAccounts: PropTypes.func.isRequired,
      fetchEnrollHealthStatus: PropTypes.func.isRequired,
      fetchDecks: PropTypes.func.isRequired,
      fetchSequence: PropTypes.func.isRequired,
      fetchProperties: PropTypes.func.isRequired,
      sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord),
      initEnrollment: PropTypes.func.isRequired,
      goBackToSequences: function goBackToSequences(props) {
        if (props.isWithinSalesModal && !props.goBackToSequences) {
          return new Error('goBackToSequences is required when isWithinSalesModal is true');
        }
      },
      enrollSequence: enrollSequencePropTypeChecker,
      disableEnrollments: PropTypes.bool.isRequired,
      enrollmentError: PropTypes.object,
      enrollMultipleContacts: PropTypes.func,
      enrollmentState: PropTypes.string,
      enrollType: EnrollTypePropType.isRequired
    },
    componentDidMount: function componentDidMount() {
      this.props.fetchEnrollHealthStatus();
      this.props.initConnectedAccounts();
      this.props.fetchDecks();
      this.props.fetchProperties();

      if (!this.props.enrolledSequence) {
        this.fetchSequence();
      }
    },
    fetchSequence: function fetchSequence() {
      this.props.fetchSequence(this.props.sequenceId);
    },
    isConnectedAccountValid: function isConnectedAccountValid() {
      return Boolean(this.props.selectedSender && !this.props.connectedAccountsError);
    },
    render: function render() {
      var _this$props = this.props,
          contacts = _this$props.contacts,
          selectedSender = _this$props.selectedSender,
          connectedAccountIsLoading = _this$props.connectedAccountIsLoading,
          connectedAccountsError = _this$props.connectedAccountsError,
          reaganTimedOut = _this$props.reaganTimedOut,
          decks = _this$props.decks,
          sequence = _this$props.sequence,
          sequenceError = _this$props.sequenceError,
          signature = _this$props.signature,
          sequenceEnrollment = _this$props.sequenceEnrollment,
          portalTimezone = _this$props.portalTimezone,
          enrolledSequence = _this$props.enrolledSequence,
          stepEnrollments = _this$props.stepEnrollments,
          user = _this$props.user,
          onConfirm = _this$props.onConfirm,
          onReject = _this$props.onReject,
          isWithinSalesModal = _this$props.isWithinSalesModal,
          goBackToSequences = _this$props.goBackToSequences,
          enrollSequence = _this$props.enrollSequence,
          disableEnrollments = _this$props.disableEnrollments,
          enrollmentError = _this$props.enrollmentError,
          initEnrollment = _this$props.initEnrollment,
          enrollMultipleContacts = _this$props.enrollMultipleContacts,
          enrollmentState = _this$props.enrollmentState,
          enrollType = _this$props.enrollType;
      return /*#__PURE__*/_jsx(ContainerWithInitializedEditor, {
        contacts: contacts,
        selectedSender: selectedSender,
        connectedAccountIsLoading: connectedAccountIsLoading,
        connectedAccountIsValid: this.isConnectedAccountValid(),
        connectedAccountsError: connectedAccountsError,
        reaganTimedOut: reaganTimedOut,
        decks: decks,
        sequence: sequence,
        sequenceError: sequenceError,
        signature: signature,
        sequenceEnrollment: sequenceEnrollment,
        portalTimezone: portalTimezone,
        enrolledSequence: enrolledSequence,
        stepEnrollments: stepEnrollments,
        user: user,
        onConfirm: onConfirm,
        onReject: onReject,
        isWithinSalesModal: isWithinSalesModal,
        goBackToSequences: goBackToSequences,
        fetchSequence: this.fetchSequence,
        initEnrollment: initEnrollment,
        enrollSequence: enrollSequence,
        disableEnrollments: disableEnrollments,
        enrollmentError: enrollmentError,
        enrollMultipleContacts: enrollMultipleContacts,
        enrollmentState: enrollmentState,
        enrollType: enrollType
      });
    }
  });
  return connect(function (state, props) {
    var connectedAccounts = state.connectedAccounts,
        decks = state.decks,
        sequence = state.sequence,
        salesModalInterface = state.salesModalInterface,
        enrollType = state.enrollType;
    var user = salesModalInterface.user,
        portal = salesModalInterface.portal,
        enrollSequence = salesModalInterface.enrollSequence,
        closeModal = salesModalInterface.closeModal;
    var portalTimezone = portal.getIn(['timezone', 'id']);
    return {
      user: user,
      portalTimezone: portalTimezone,
      enrollSequence: enrollSequence,
      onReject: closeModal,
      signature: connectedAccounts.signature,
      selectedSender: connectedAccounts.selectedSender,
      connectedAccountIsLoading: connectedAccounts.fetching,
      connectedAccountsError: connectedAccounts.error,
      decks: decks.data,
      sequence: props.enrolledSequence || sequence.data,
      sequenceError: sequence.error,
      disableEnrollments: shouldDisableEnrollments(state),
      enrollType: enrollType
    };
  }, Object.assign({}, ConnectedAccountsActions, {}, SequenceActions, {}, EnrollHealthStatusActions, {}, PropertiesActions, {}, DecksActions, {
    initEnrollment: initEnrollmentAction
  }))(EnrollmentModal);
});