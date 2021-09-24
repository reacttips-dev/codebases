'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { connect } from 'react-redux';
import * as EnrollmentStateActions from 'sales-modal/redux/actions/EnrollmentStateActions';
import { getSelectedSequenceEnrollmentRecord, getContacts, getIneligibleContactsList, getSelectedContact, getStepsWithSendTimeErrors as getStepsWithSendTimeErrorsSelector, getEnrollmentStateError, getEnrollmentError } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
export default (function (WrappedComponent) {
  return connect(function (state) {
    return {
      contacts: getContacts(state),
      ineligibleContacts: getIneligibleContactsList(state),
      selectedContact: getSelectedContact(state),
      sequenceEnrollment: getSelectedSequenceEnrollmentRecord(state),
      stepsWithSendTimeErrors: getStepsWithSendTimeErrorsSelector(state),
      enrollmentStateError: getEnrollmentStateError(state),
      enrollmentError: getEnrollmentError(state)
    };
  }, {
    initEnrollmentState: EnrollmentStateActions.initEnrollmentState,
    enrollSingleContact: EnrollmentStateActions.enrollSingleContact,
    removeContacts: EnrollmentStateActions.removeContacts
  })(function (props) {
    var initEnrollmentState = props.initEnrollmentState;
    useEffect(function () {
      initEnrollmentState();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return /*#__PURE__*/_jsx(WrappedComponent, Object.assign({}, props));
  });
});