'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { Map as ImmutableMap } from 'immutable';
import partial from 'transmute/partial';
import { UsageTracker } from 'sales-modal/utils/enrollModal/UsageLogger';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import { trackBulkEnrollSuccess, trackBulkEnrollFailuresByKey, trackBulkEnrollError } from 'sales-modal/lib/CustomPageActions';
import { simpleAction } from 'sales-modal/utils/salesModalReduxUtils';
import * as actionTypes from '../actionTypes';
import { getRecipientContactIds } from '../selectors/RecipientSelectors';
import { getNextContactId, getFilteredContacts, getUnenrolledContacts, getRecommendedSendTimes } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import { getPlatform } from 'sales-modal/redux/selectors/SenderSelectors';
import { fetchBatchVidOrEmail, checkCommunicationPermissions } from 'sales-modal/api/ContactApi';
import { fetchEligibility, fetchEligibilityBatch } from 'sales-modal/api/SequencesApi';
import postProcessSequenceEnrollment from 'sales-modal/utils/enrollModal/postProcessSequenceEnrollment';
import { PRIMARY_SEQUENCE_ID } from 'sales-modal/constants/BulkEnrollConstants';
import { EnrollTypes } from 'sales-modal/constants/EnrollTypes';

var trackSentBulkSequence = function trackSentBulkSequence(properties) {
  UsageTracker.track('sentBulkSequence', properties);
};

var CONTACTS_OBJECT_ID = '0-1';
export var initEnrollmentStateAction = partial(simpleAction, actionTypes.ENROLLMENT_STATE_INIT);
export var initEnrollmentStateStartedAction = partial(simpleAction, actionTypes.ENROLLMENT_STATE_INIT_STARTED);
export var initEnrollmentStateFailedAction = partial(simpleAction, actionTypes.ENROLLMENT_STATE_INIT_FAILED);
export var updateSearchText = partial(simpleAction, actionTypes.ENROLLMENT_STATE_UPDATED_SEARCH_TEXT);
export var resetSearchText = partial(simpleAction, actionTypes.ENROLLMENT_STATE_RESET_SEARCH_TEXT);
export var initEnrollmentState = function initEnrollmentState() {
  return function (dispatch, getState) {
    dispatch(initEnrollmentStateStartedAction());
    var state = getState();
    var contactIds = getRecipientContactIds(state);
    var isBulkEnroll = state.enrollType === EnrollTypes.BULK_ENROLL;
    fetchBatchVidOrEmail(contactIds).then(function (contacts) {
      var contactsMap = contacts.toOrderedMap();

      if (state.enrollType === EnrollTypes.VIEW) {
        var selectedContact = contacts.keySeq().first(); // VIEW only applies to a single enrollment

        dispatch(initEnrollmentStateAction({
          contacts: contactsMap,
          selectedContact: selectedContact,
          eligibilityMap: ImmutableMap().set(selectedContact, ImmutableMap())
        }));
        return;
      }

      var nonContactRecipient = contacts.size === 1 && contacts.first().vid === null;
      var eligibilityPromise = nonContactRecipient ? fetchEligibility(getProperty(contacts.first(), 'email')).then(function (eligibility) {
        return ImmutableMap().set(getProperty(contacts.first(), 'email'), eligibility);
      }) : fetchEligibilityBatch(contacts.keySeq().toArray());
      var permissionsPromise = nonContactRecipient ? Promise.resolve() : checkCommunicationPermissions(contacts.keySeq().toArray());
      Promise.all([eligibilityPromise, permissionsPromise]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            eligibilityMap = _ref2[0],
            permissionsObject = _ref2[1];

        var updatedEligibilityMap = eligibilityMap;

        if (!nonContactRecipient) {
          var communicatableVids = permissionsObject.getIn(['communicatableObjects', CONTACTS_OBJECT_ID]);
          var contactsWithoutPermission = communicatableVids ? contacts.filterNot(function (contact) {
            return communicatableVids.contains(contact.get('vid'));
          }) : contacts;
          updatedEligibilityMap = eligibilityMap.map(function (eligibility, contactId) {
            if (contactsWithoutPermission.has(contactId)) {
              return eligibility.set('cannotCommunicate', true);
            }

            return eligibility;
          });
        }

        dispatch(initEnrollmentStateAction({
          contacts: contactsMap,
          selectedContact: isBulkEnroll ? PRIMARY_SEQUENCE_ID : contacts.keySeq().first(),
          eligibilityMap: updatedEligibilityMap
        }));
      }).catch(function (error) {
        dispatch(initEnrollmentStateFailedAction(error));
        throw error;
      });
    }).catch(function (error) {
      dispatch(initEnrollmentStateFailedAction(error));
      throw error;
    });
  };
};
export var singleEnrollmentSucceeded = partial(simpleAction, actionTypes.ENROLLMENT_STATE_SINGLE_ENROLLMENT_SUCCEEDED);
export var bulkEnrollmentSucceeded = partial(simpleAction, actionTypes.ENROLLMENT_STATE_BULK_ENROLLMENT_SUCCEEDED);
export var selectContact = partial(simpleAction, actionTypes.ENROLLMENT_STATE_SELECT_CONTACT);
export var removeContactsAction = partial(simpleAction, actionTypes.ENROLLMENT_STATE_REMOVE_CONTACTS);
export var removeContacts = function removeContacts(contacts) {
  return function (dispatch, getState) {
    var filteredContacts = getFilteredContacts(getState());
    filteredContacts = filteredContacts.filterNot(function (_, contactId) {
      return contacts.contains(contactId);
    });

    if (!filteredContacts.size) {
      dispatch(resetSearchText());
    }

    dispatch(removeContactsAction({
      contacts: contacts,
      nextContactId: getNextContactId(getState())
    }));
  };
};
var _pendingSingleEnroll = null;
export var enrollSingleContact = function enrollSingleContact(_ref3) {
  var selectedContact = _ref3.selectedContact,
      enrollSequence = _ref3.enrollSequence,
      contact = _ref3.contact,
      sequenceEnrollment = _ref3.sequenceEnrollment,
      onConfirm = _ref3.onConfirm;
  return function (dispatch, getState) {
    if (!_pendingSingleEnroll) {
      var unenrolledContactsCount = getUnenrolledContacts(getState()).size;
      var recommendedSendTimes = getRecommendedSendTimes(getState());
      _pendingSingleEnroll = postProcessSequenceEnrollment({
        sequenceEnrollments: ImmutableMap(_defineProperty({}, selectedContact, sequenceEnrollment)),
        recommendedSendTimes: recommendedSendTimes
      }).then(function (updatedEnrollments) {
        var updatedEnrollment = ImmutableMap.isMap(updatedEnrollments) ? updatedEnrollments.first() : updatedEnrollments;
        _pendingSingleEnroll = enrollSequence({
          enrollment: updatedEnrollment,
          vid: selectedContact,
          email: getProperty(contact, 'email')
        }).then(function () {
          var newUnenrolledContactsCount = unenrolledContactsCount - 1;

          if (newUnenrolledContactsCount === 0) {
            onConfirm({});
            return;
          }

          var filteredContacts = getFilteredContacts(getState());

          if (filteredContacts.size === 1 && filteredContacts.has(selectedContact)) {
            dispatch(resetSearchText());
          }

          trackSentBulkSequence({
            count: 1,
            sentTo: 1,
            error: 0,
            sequenceId: sequenceEnrollment.id
          });
          dispatch(singleEnrollmentSucceeded({
            contactId: selectedContact,
            nextContactId: getNextContactId(getState()),
            sequenceEnrollment: updatedEnrollments
          }));
        }).catch(function () {
          trackSentBulkSequence({
            count: 1,
            sentTo: 0,
            error: 1,
            sequenceId: sequenceEnrollment.id
          });
        }).finally(function () {
          _pendingSingleEnroll = null;
        });
      }, function (err) {
        throw err;
      });
    }

    return _pendingSingleEnroll;
  };
};
var _pendingBulkEnroll = null;
export var bulkEnrollContacts = function bulkEnrollContacts(_ref4) {
  var onConfirm = _ref4.onConfirm,
      sequenceEnrollments = _ref4.sequenceEnrollments,
      enrollMultipleContacts = _ref4.enrollMultipleContacts;
  return function (dispatch, getState) {
    if (!_pendingBulkEnroll) {
      var unenrolledContacts = getUnenrolledContacts(getState());
      var recommendedSendTimes = getRecommendedSendTimes(getState());
      _pendingBulkEnroll = postProcessSequenceEnrollment({
        sequenceEnrollments: sequenceEnrollments,
        recommendedSendTimes: recommendedSendTimes
      }).then(function (updatedEnrollments) {
        _pendingBulkEnroll = enrollMultipleContacts({
          enrollments: updatedEnrollments
        }).then(function (response) {
          var successes = response.get('successes');
          var unenrolledContactsIds = unenrolledContacts.keySeq().toSet().subtract(successes);
          trackSentBulkSequence({
            count: sequenceEnrollments.size,
            sentTo: successes.size,
            error: response.get('failures').size,
            sequenceId: sequenceEnrollments.first().id
          });
          var platform = getPlatform(getState());

          if (successes.size > 0) {
            trackBulkEnrollSuccess(platform);
          }

          if (response.get('failures').size > 0) {
            trackBulkEnrollFailuresByKey(platform, response.get('failuresByKey'));
          }

          if (!unenrolledContactsIds.size) {
            onConfirm({});
            return;
          }

          var filteredContacts = getFilteredContacts(getState());
          var visibleContacts = filteredContacts.filterNot(function (_, contactId) {
            return successes.contains(contactId);
          });

          if (!visibleContacts.size) {
            dispatch(resetSearchText());
          }

          dispatch(bulkEnrollmentSucceeded({
            nextContactId: visibleContacts.keySeq().first() || unenrolledContactsIds.first(),
            sequenceEnrollments: updatedEnrollments.filter(function (_, contactId) {
              return successes.includes(contactId);
            })
          }));
        }, function (err) {
          trackBulkEnrollError(getPlatform(getState()), err);
          throw err;
        }).catch(function (err) {
          trackSentBulkSequence({
            count: sequenceEnrollments.size,
            sentTo: 0,
            error: sequenceEnrollments.size,
            sequenceId: sequenceEnrollments.first().id
          });
          throw err;
        }).finally(function () {
          _pendingBulkEnroll = null;
        });
      }, function (err) {
        throw err;
      });
    }

    return _pendingBulkEnroll;
  };
};