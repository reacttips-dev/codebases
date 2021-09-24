'use es6';

import { combineReducers } from 'redux';
import contacts from './enrollmentState/contacts';
import contactEnrollStatus from './enrollmentState/contactEnrollStatus';
import contactEligibility from './enrollmentState/contactEligibility';
import sequenceEnrollments from './enrollmentState/sequenceEnrollments';
import enrollmentHasBeenEdited from './enrollmentState/enrollmentHasBeenEdited';
import enrollmentStateError from './enrollmentState/enrollmentStateError';
import requestStatus from './enrollmentState/requestStatus';
import enrollmentError from './enrollmentState/enrollmentError';
import searchText from './enrollmentState/searchText';
import sendTimeData from './enrollmentState/sendTimeData';
import sendTimeAlertTracking from './enrollmentState/sendTimeAlertTracking';
export default combineReducers({
  contacts: contacts,
  contactEnrollStatus: contactEnrollStatus,
  contactEligibility: contactEligibility,
  sequenceEnrollments: sequenceEnrollments,
  enrollmentHasBeenEdited: enrollmentHasBeenEdited,
  enrollmentStateError: enrollmentStateError,
  requestStatus: requestStatus,
  enrollmentError: enrollmentError,
  searchText: searchText,
  sendTimeData: sendTimeData,
  sendTimeAlertTracking: sendTimeAlertTracking
});