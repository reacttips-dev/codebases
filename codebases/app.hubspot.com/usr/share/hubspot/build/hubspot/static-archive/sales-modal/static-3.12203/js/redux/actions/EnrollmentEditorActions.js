'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import Raven from 'Raven';
import { Map as ImmutableMap } from 'immutable';
import partial from 'transmute/partial';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import { GENERAL_ERROR, CONTACT_MISSING_EMAIL } from 'sales-modal/constants/EnrollmentEditorEnrollmentErrors';
import * as SequencesApi from 'sales-modal/api/SequencesApi';
import * as EmailRecommendationsActions from 'sales-modal/redux/actions/EmailRecommendationsActions';
import { PRIMARY_SEQUENCE_ID } from 'sales-modal/constants/BulkEnrollConstants';
import { makeUnsubscribeLink } from 'sales-modal/lib/links';
import { EnrollTypes } from 'sales-modal/constants/EnrollTypes';
import fetchSequenceData from 'sales-modal/lib/fetchSequenceData';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import { simpleAction } from 'sales-modal/utils/salesModalReduxUtils';
import { getSelectedContact, getSelectedContactRecord, getSelectedSequenceEnrollmentRecord, getSelectedContactEmail, getContacts, getOriginalEditedEnrollment, getStepErrorTypes } from '../selectors/EnrollmentStateSelectors';
import { getGateMap, getScopeMap } from 'sales-modal/redux/selectors/permissionSelectors';
import { ENROLLMENT_STATE_ENROLLMENT_INIT, ENROLLMENT_ERROR, ENROLLMENT_STATE_INIT_FAILED, ENROLLMENT_STATE_CONTACTS_REORDERED, ENROLLMENT_SEND_TIMES_FETCH_SUCCEEDED, SEND_LIMITS_FETCH_SUCCEEDED, VIEWED_SEND_TIME_ALERT, RECOMMENDED_SEND_TIMES_FETCH_SUCCEEDED } from '../actionTypes';
import { SET_TIMEZONE, SET_STARTING_STEP_ORDER, SET_STEP_DELAY, SET_FIRST_SEND_TYPE, SET_TIME_OF_DAY, TOGGLE_STEP_DEPENDENCY, SET_UNSUBSCRIBE_LINKS, SET_STEP_METADATA, SET_MERGE_TAGS, SET_RECOMMENDED_SEND_TIMES, APPLY_ENROLLMENT_SETTINGS } from '../enrollmentEditActionTypes';
import getMissingMergeTags from 'sales-modal/redux/utils/getMissingMergeTags';
import { EnrollmentStates } from '../../constants/EnrollmentStates';
export var enrollmentEditorEnrollmentInit = partial(simpleAction, ENROLLMENT_STATE_ENROLLMENT_INIT);
export var initEnrollmentErrorAction = partial(simpleAction, ENROLLMENT_ERROR);
export var initEnrollmentStateFailedAction = partial(simpleAction, ENROLLMENT_STATE_INIT_FAILED);
export var enrollmentSendTimeFetchSucceeded = partial(simpleAction, ENROLLMENT_SEND_TIMES_FETCH_SUCCEEDED);
export var enrollmentSendLimitFetchSucceeded = partial(simpleAction, SEND_LIMITS_FETCH_SUCCEEDED);
export var viewedSendTimeAlert = partial(simpleAction, VIEWED_SEND_TIME_ALERT);
export var recommendedSendTimesFetchSucceeded = partial(simpleAction, RECOMMENDED_SEND_TIMES_FETCH_SUCCEEDED);

var sortContactsByErrorAndLastName = function sortContactsByErrorAndLastName(contacts, enrollmentsWithTokenErrors) {
  return contacts.sort(function (a, b) {
    var aHasTokenErrors = enrollmentsWithTokenErrors.has("" + a.vid);
    var bHasTokenErrors = enrollmentsWithTokenErrors.has("" + b.vid);
    if (aHasTokenErrors && !bHasTokenErrors) return -1;
    if (bHasTokenErrors && !aHasTokenErrors) return 1;
    return 0;
  });
};

export var fetchSendLimits = function fetchSendLimits(sequenceEnrollment) {
  return function (dispatch) {
    SequencesApi.fetchSendLimits(sequenceEnrollment).then(function (response) {
      dispatch(enrollmentSendLimitFetchSucceeded(response));
    });
  };
};

var setEnrollmentRecommendSendTimes = function setEnrollmentRecommendSendTimes(contactEmail) {
  return function (dispatch, getState) {
    var sequenceEnrollment = getSelectedSequenceEnrollmentRecord(getState());
    return EmailRecommendationsActions.fetchSendTimeRecommendations(sequenceEnrollment, contactEmail).then(function (sendTimeRecommendations) {
      var currentEnrollment = getSelectedSequenceEnrollmentRecord(getState());
      var selectedContact = getSelectedContact(getState());

      if (!sequenceEnrollment || !currentEnrollment) {
        return;
      }

      if (sequenceEnrollment && currentEnrollment && sequenceEnrollment.id !== currentEnrollment.id) {
        return;
      }

      dispatch(simpleAction(SET_RECOMMENDED_SEND_TIMES, {
        selectedContact: selectedContact,
        sendTimeRecommendations: sendTimeRecommendations
      }));
      dispatch(recommendedSendTimesFetchSucceeded(sendTimeRecommendations));
    });
  };
};

export var initEnrollment = function initEnrollment(_ref) {
  var vid = _ref.vid,
      recipientEmail = _ref.recipientEmail,
      selectedSender = _ref.selectedSender,
      signature = _ref.signature,
      portalTimezone = _ref.portalTimezone,
      sequence = _ref.sequence,
      hasEnrolledSequence = _ref.hasEnrolledSequence,
      stepEnrollments = _ref.stepEnrollments,
      enrollmentState = _ref.enrollmentState;
  return function (dispatch, getState) {
    var state = getState();
    var _state$content = state.content,
        supplementalObjectType = _state$content.supplementalObjectType,
        supplementalObjectId = _state$content.supplementalObjectId;
    var contactId = vid || recipientEmail;
    var gates = getGateMap(state);
    var scopes = getScopeMap(state);
    var contact = getSelectedContactRecord(state);
    var contacts = ImmutableMap(_defineProperty({}, contactId, contact));
    var contactEmail = getProperty(contact, 'email') || null;
    var enrollType = state.enrollType;

    if (!contactEmail) {
      dispatch(initEnrollmentErrorAction({
        contact: contact,
        contactId: contactId,
        enrollmentEditorEnrollmentError: CONTACT_MISSING_EMAIL
      }));
      return Promise.resolve();
    }

    return fetchSequenceData({
      supplementalObjectType: supplementalObjectType,
      supplementalObjectId: supplementalObjectId,
      sequence: sequence,
      hasEnrolledSequence: hasEnrolledSequence,
      contacts: contacts,
      enrollType: enrollType
    }).then(function (_ref2) {
      var renderedTemplates = _ref2.renderedTemplates,
          unsubscribeLink = _ref2.unsubscribeLink,
          unsubscribeLinkType = _ref2.unsubscribeLinkType;
      var sequenceEnrollment = SequenceEnrollmentRecord.init({
        renderedTemplates: renderedTemplates ? renderedTemplates.get(contactId) : undefined,
        selectedSender: selectedSender,
        portalTimezone: portalTimezone,
        sequence: sequence,
        signature: signature,
        hasEnrolledSequence: hasEnrolledSequence,
        stepEnrollments: stepEnrollments,
        unsubscribeLink: unsubscribeLink,
        unsubscribeLinkType: unsubscribeLinkType,
        enrollmentState: enrollmentState,
        gates: gates,
        scopes: scopes,
        enrollType: enrollType
      });
      var sendTimePromise;

      if (enrollmentState === EnrollmentStates.PAUSED || enrollType === EnrollTypes.VIEW) {
        // Skip send time checks when the enrollment is paused. Steps will be
        // rescheduled later anyway, so the times are placeholders.
        sendTimePromise = Promise.resolve(null);
      } else {
        var sendLimitsFetch = SequencesApi.fetchSendLimits(sequenceEnrollment);
        var sendTimeDataFetch = SequencesApi.fetchSendTimeData({
          numTimes: 1,
          sequenceEnrollment: sequenceEnrollment,
          originalEnrollment: getOriginalEditedEnrollment(state)
        });
        sendTimePromise = Promise.all([sendTimeDataFetch, sendLimitsFetch]).then(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
              sendTimeData = _ref4[0],
              sendLimits = _ref4[1];

          dispatch(enrollmentSendTimeFetchSucceeded(sendTimeData));
          dispatch(enrollmentSendLimitFetchSucceeded(sendLimits));
        });
      }

      sendTimePromise.then(function () {
        dispatch(enrollmentEditorEnrollmentInit({
          sequenceEnrollments: ImmutableMap(_defineProperty({}, contactId, sequenceEnrollment))
        }));

        if (enrollType !== EnrollTypes.EDIT && enrollType !== EnrollTypes.RESUME && enrollType !== EnrollTypes.VIEW) {
          dispatch(setEnrollmentRecommendSendTimes(contactEmail));
        }
      }, function () {
        dispatch(initEnrollmentErrorAction({
          contactId: contactId,
          contact: contact,
          enrollmentEditorEnrollmentError: GENERAL_ERROR
        }));
      });
    }, function (err) {
      dispatch(initEnrollmentErrorAction({
        contactId: contactId,
        contact: contact,
        enrollmentEditorEnrollmentError: GENERAL_ERROR
      }));
      Raven.captureMessage('[sales-modal] Sequence render error', {
        extra: {
          statusCode: err.status,
          statusText: err.statusText,
          responseText: err.responseText
        }
      });
    });
  };
};
export var initBulkEnrollment = function initBulkEnrollment(_ref5) {
  var sequence = _ref5.sequence,
      selectedSender = _ref5.selectedSender,
      signature = _ref5.signature,
      portalTimezone = _ref5.portalTimezone,
      hasEnrolledSequence = _ref5.hasEnrolledSequence,
      stepEnrollments = _ref5.stepEnrollments;
  return function (dispatch, getState) {
    var state = getState();
    var contacts = getContacts(state);
    var _state$content2 = state.content,
        supplementalObjectType = _state$content2.supplementalObjectType,
        supplementalObjectId = _state$content2.supplementalObjectId;
    var gates = getGateMap(state);
    var scopes = getScopeMap(state);
    var enrollType = state.enrollType;
    return fetchSequenceData({
      supplementalObjectType: supplementalObjectType,
      supplementalObjectId: supplementalObjectId,
      sequence: sequence,
      hasEnrolledSequence: hasEnrolledSequence,
      contacts: contacts,
      enrollType: enrollType
    }).then(function (_ref6) {
      var renderedTemplates = _ref6.renderedTemplates,
          unsubscribeLink = _ref6.unsubscribeLink,
          unsubscribeLinkType = _ref6.unsubscribeLinkType,
          unrenderedTemplates = _ref6.unrenderedTemplates;
      var sequenceEnrollmentRecordProps = {
        selectedSender: selectedSender,
        portalTimezone: portalTimezone,
        sequence: sequence,
        signature: signature,
        hasEnrolledSequence: false,
        enrollType: enrollType,
        unsubscribeLinkType: unsubscribeLinkType,
        stepEnrollments: stepEnrollments
      };
      var sequenceEnrollments = contacts.map(function (contact) {
        var contactId = "" + contact.get('vid');
        return SequenceEnrollmentRecord.init(Object.assign({}, sequenceEnrollmentRecordProps, {
          renderedTemplates: renderedTemplates.get(contactId),
          isBulkEnroll: true,
          gates: gates,
          scopes: scopes,
          unsubscribeLink: makeUnsubscribeLink(unsubscribeLink, getProperty(contact, 'email'))
        }));
      }).set(PRIMARY_SEQUENCE_ID, SequenceEnrollmentRecord.init(Object.assign({}, sequenceEnrollmentRecordProps, {
        renderedTemplates: unrenderedTemplates,
        isBulkEnroll: true,
        gates: gates,
        scopes: scopes,
        isPrimarySequence: true
      })));
      var sendLimitsFetch = SequencesApi.fetchSendLimits(sequenceEnrollments.first());
      var sendTimeDataFetch = SequencesApi.fetchSendTimeData({
        numTimes: contacts.size,
        sequenceEnrollment: sequenceEnrollments.first()
      });
      Promise.all([sendTimeDataFetch, sendLimitsFetch]).then(function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 2),
            sendTimeData = _ref8[0],
            sendLimits = _ref8[1];

        dispatch(enrollmentSendTimeFetchSucceeded(sendTimeData));
        dispatch(enrollmentSendLimitFetchSucceeded(sendLimits));
        var enrollmentsWithTokenErrors = sequenceEnrollments.filter(function (sequenceEnrollment) {
          return getMissingMergeTags({
            sequenceEnrollment: sequenceEnrollment
          }).size;
        });
        var sortedContacts = contacts.sortBy(function (contact) {
          return getProperty(contact, 'lastname') || '';
        });
        dispatch(simpleAction(ENROLLMENT_STATE_CONTACTS_REORDERED, {
          contacts: sortContactsByErrorAndLastName(sortedContacts, enrollmentsWithTokenErrors)
        }));
        return dispatch(enrollmentEditorEnrollmentInit({
          sequenceEnrollments: ImmutableMap(sequenceEnrollments)
        }));
      }, function (error) {
        return dispatch(initEnrollmentStateFailedAction(error));
      });
    }, function (error) {
      dispatch(initEnrollmentStateFailedAction(error));
      Raven.captureMessage('[sales-modal] Render sequence error', {
        extra: {
          statusCode: error.status,
          statusText: error.statusText,
          responseText: error.responseText
        }
      });
    });
  };
};
export var applySendOptions = function applySendOptions(_ref9) {
  var startOfTimeRange = _ref9.startOfTimeRange,
      endOfTimeRange = _ref9.endOfTimeRange,
      eligibleFollowUpDays = _ref9.eligibleFollowUpDays,
      useThreadedFollowUps = _ref9.useThreadedFollowUps,
      taskReminderMinute = _ref9.taskReminderMinute,
      individualTaskRemindersEnabled = _ref9.individualTaskRemindersEnabled;
  return function (dispatch, getState) {
    var selectedSequenceEnrollment = getSelectedSequenceEnrollmentRecord(getState());
    var contactEmail = getSelectedContactEmail(getState());
    var selectedContact = getSelectedContact(getState());
    var enrollType = getState().enrollType;
    var sendTimeRangeChanged = startOfTimeRange !== selectedSequenceEnrollment.sequenceSettings.sendWindowStartsAtMin || endOfTimeRange !== selectedSequenceEnrollment.sequenceSettings.sendWindowEndsAtMin;
    dispatch(simpleAction(APPLY_ENROLLMENT_SETTINGS, {
      startOfTimeRange: startOfTimeRange,
      endOfTimeRange: endOfTimeRange,
      eligibleFollowUpDays: eligibleFollowUpDays,
      useThreadedFollowUps: useThreadedFollowUps,
      taskReminderMinute: taskReminderMinute,
      individualTaskRemindersEnabled: individualTaskRemindersEnabled,
      isBulkEnroll: enrollType === EnrollTypes.BULK_ENROLL
    }));

    if (selectedContact !== PRIMARY_SEQUENCE_ID && sendTimeRangeChanged) {
      dispatch(setEnrollmentRecommendSendTimes(contactEmail));
    }
  };
};
export var enrollmentSetStepDelay = function enrollmentSetStepDelay(payload) {
  return simpleAction(SET_STEP_DELAY, payload);
};
export var enrollmentSetTimeOfDay = function enrollmentSetTimeOfDay(payload) {
  return simpleAction(SET_TIME_OF_DAY, payload);
};
export var enrollmentSetStartingOrder = function enrollmentSetStartingOrder(payload) {
  return simpleAction(SET_STARTING_STEP_ORDER, payload);
};
export var enrollmentSetTimezone = function enrollmentSetTimezone(timezone) {
  return function (dispatch, getState) {
    var selectedContact = getSelectedContact(getState());
    var contactEmail = getSelectedContactEmail(getState());
    var enrollType = getState().enrollType;
    dispatch(simpleAction(SET_TIMEZONE, {
      enrollType: enrollType,
      timezone: timezone
    }));

    if (selectedContact !== PRIMARY_SEQUENCE_ID) {
      dispatch(setEnrollmentRecommendSendTimes(contactEmail));
    }
  };
};
export var enrollmentSetFirstSendType = function enrollmentSetFirstSendType(firstSendType) {
  return function (dispatch, getState) {
    var enrollType = getState().enrollType;
    dispatch(simpleAction(SET_FIRST_SEND_TYPE, {
      firstSendType: firstSendType,
      enrollType: enrollType
    }));
  };
};
export var enrollmentSetStepMetadata = function enrollmentSetStepMetadata(_ref10) {
  var metadata = _ref10.metadata,
      step = _ref10.step,
      _ref10$isSubjectChang = _ref10.isSubjectChange,
      isSubjectChange = _ref10$isSubjectChang === void 0 ? false : _ref10$isSubjectChang;
  return function (dispatch, getState) {
    var selectedContact = getSelectedContact(getState());
    dispatch(simpleAction(SET_STEP_METADATA, {
      selectedContact: selectedContact,
      metadata: metadata,
      step: step,
      isSubjectChange: isSubjectChange
    }));
  };
};
export var enrollmentSetMergeTags = function enrollmentSetMergeTags(mergeTagInputFields) {
  return function (dispatch, getState) {
    var selectedContact = getSelectedContact(getState());
    var erroringSteps = getStepErrorTypes(getState());
    dispatch(simpleAction(SET_MERGE_TAGS, {
      selectedContact: selectedContact,
      mergeTagInputFields: mergeTagInputFields,
      erroringSteps: erroringSteps
    }));
  };
};
export var enrollmentSetUnsubscribeLinks = function enrollmentSetUnsubscribeLinks(blockData) {
  return function (dispatch, getState) {
    var selectedContact = getSelectedContact(getState());
    dispatch(simpleAction(SET_UNSUBSCRIBE_LINKS, {
      selectedContact: selectedContact,
      blockData: blockData
    }));
  };
};
export var enrollmentFetchSendTimeEligibility = function enrollmentFetchSendTimeEligibility() {
  return function (dispatch, getState) {
    var contacts = getContacts(getState());
    var sequenceEnrollment = getSelectedSequenceEnrollmentRecord(getState());
    var originalEnrollment = getOriginalEditedEnrollment(getState());
    SequencesApi.fetchSendTimeData({
      numTimes: contacts.size,
      sequenceEnrollment: sequenceEnrollment,
      originalEnrollment: originalEnrollment
    }).then(function (response) {
      dispatch(enrollmentSendTimeFetchSucceeded(response));
    });
  };
};
export var enrollmentToggleStepDependency = function enrollmentToggleStepDependency(payload) {
  return simpleAction(TOGGLE_STEP_DEPENDENCY, payload);
};