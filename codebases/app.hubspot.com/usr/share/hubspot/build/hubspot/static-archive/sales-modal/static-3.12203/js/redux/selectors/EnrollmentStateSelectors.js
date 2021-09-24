'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { OrderedMap, Map as ImmutableMap } from 'immutable';
import { createSelector } from 'reselect';
import { getProperty } from 'customer-data-objects/record/ObjectRecordAccessors';
import getIneligibleContactReason from 'sales-modal/utils/enrollModal/getIneligibleContactReason';
import { SEND_TEMPLATE } from 'sales-modal/constants/SequenceStepTypes';
import formatName from 'I18n/utils/formatName';
import { PRIMARY_SEQUENCE_ID } from 'sales-modal/constants/BulkEnrollConstants';
import * as SendTimeAlertWarningTypes from 'sales-modal/constants/SendTimeAlertWarningTypes';
import * as SendTimesNotAvailableReasons from 'sales-modal/constants/SendTimesNotAvailableReasons';
import { isSameDay } from 'sales-modal/utils/enrollModal/SendTimeUtils';
import getMissingMergeTags from 'sales-modal/redux/utils/getMissingMergeTags';
import getErrorTypes from 'sales-modal/redux/utils/getErrorTypes';
import hasErrors from 'sales-modal/redux/utils/hasErrors';
export var getSelectedContact = function getSelectedContact(state) {
  return state.enrollmentState.contacts.selectedContact;
};
export var getContacts = function getContacts(state) {
  return state.enrollmentState.contacts.contactMap;
};
export var getSequenceEnrollments = function getSequenceEnrollments(state) {
  return state.enrollmentState.sequenceEnrollments;
};
export var getEnrollStatus = function getEnrollStatus(state) {
  return state.enrollmentState.contactEnrollStatus;
};
export var getEligibility = function getEligibility(state) {
  return state.enrollmentState.contactEligibility;
};
export var getSequenceEnrollmentHasBeenEdited = function getSequenceEnrollmentHasBeenEdited(state) {
  return state.enrollmentState.enrollmentHasBeenEdited;
};
export var getEnrollmentStateError = function getEnrollmentStateError(state) {
  return !!state.enrollmentState.enrollmentStateError;
};
export var getSelectedSenderFromAddress = function getSelectedSenderFromAddress(state) {
  return state.connectedAccounts.selectedSender.fromAddress;
};
export var getEnrollmentError = function getEnrollmentError(state) {
  return state.enrollmentState.enrollmentError;
};
export var getSearchText = function getSearchText(state) {
  return state.enrollmentState.searchText;
};
export var getSendTimeData = function getSendTimeData(state) {
  return state.enrollmentState.sendTimeData;
};

var getSalesModalInterface = function getSalesModalInterface(state) {
  return state.salesModalInterface;
};

export var getSequenceName = createSelector([getSequenceEnrollments], function (sequenceEnrollments) {
  return sequenceEnrollments.first() && sequenceEnrollments.first().get('name');
});
export var getContactList = createSelector([getContacts], function (contacts) {
  return contacts.keySeq().toList();
});
export var getIneligibleContactsList = createSelector([getContacts, getEligibility], function (contactMap, eligibilityMap) {
  return contactMap.filter(function (contact, id) {
    return getIneligibleContactReason({
      contact: contact,
      eligibility: eligibilityMap.get(id)
    });
  }).keySeq();
});
export var getSequenceEnrollmentTokenErrors = createSelector([getSequenceEnrollments], function (sequenceEnrollments) {
  return sequenceEnrollments.map(function (sequenceEnrollment) {
    if (!sequenceEnrollment) return null;
    return getMissingMergeTags({
      sequenceEnrollment: sequenceEnrollment
    }).size;
  });
});
export var getSelectedContactRecord = createSelector([getContacts, getSelectedContact], function (contactMap, selectedContact) {
  return contactMap && contactMap.get(selectedContact);
});
export var getSelectedSequenceEnrollmentTokenErrors = createSelector([getSequenceEnrollmentTokenErrors, getSelectedContact], function (enrollmentTokenErrors, selectedContact) {
  return enrollmentTokenErrors && enrollmentTokenErrors.get(selectedContact);
});
export var getSelectedContactEmail = createSelector([getSelectedContactRecord], function (contact) {
  return contact && getProperty(contact, 'email');
});
export var getSelectedEnrollment = createSelector([getSelectedContact, getSequenceEnrollments], function (selectedContact, sequenceEnrollments) {
  if (!selectedContact) {
    return null;
  }

  return sequenceEnrollments.get(selectedContact);
});
export var getSelectedSequenceEnrollmentRecord = createSelector([getSelectedContact, getSequenceEnrollments], function (selectedContact, sequenceEnrollmentMap) {
  return sequenceEnrollmentMap && sequenceEnrollmentMap.get(selectedContact);
});
export var getSelectedSequenceEnrollmentFromAddress = createSelector([getSelectedSequenceEnrollmentRecord], function (sequenceEnrollment) {
  return sequenceEnrollment.fromAddress;
});
export var getSelectedSequenceEnrollmentRecordHasBeenEdited = createSelector([getSelectedContact, getSequenceEnrollmentHasBeenEdited], function (selectedContact, sequenceEnrollmentHasBeenEdited) {
  return !!(sequenceEnrollmentHasBeenEdited && sequenceEnrollmentHasBeenEdited.get(selectedContact));
});
export var getSelectedContactEligibility = createSelector([getSelectedContact, getEligibility], function (selectedContact, eligibilityMap) {
  return eligibilityMap && eligibilityMap.get(selectedContact);
});
export var getSequenceHasPrivateTemplates = createSelector(getSequenceEnrollments, function (sequenceEnrollmentMap) {
  if (!sequenceEnrollmentMap.first()) {
    return false;
  }

  return sequenceEnrollmentMap.first().get('steps').some(function (step) {
    return step.get('action') === SEND_TEMPLATE && step.getIn(['actionMeta', 'templateMeta', 'body']) === null;
  });
});
export var getUnenrolledContacts = createSelector([getContacts, getEnrollStatus], function (contacts, enrollStatus) {
  return contacts.keySeq().toList().reduce(function (acc, contact) {
    if (enrollStatus.get(contact) !== 'SUCCEEDED') {
      return acc.set(contact, contacts.get(contact));
    }

    return acc;
  }, OrderedMap());
});
export var getUnenrolledEnrollments = createSelector([getSequenceEnrollments, getEnrollStatus], function (sequenceEnrollmentMap, enrollStatusMap) {
  return enrollStatusMap.filterNot(function (status) {
    return status === 'SUCCEEDED';
  }).map(function (status, contactId) {
    return sequenceEnrollmentMap.get(contactId);
  });
});
export var getReadySequenceEnrollments = createSelector([getUnenrolledEnrollments, getSequenceEnrollmentTokenErrors], function (unenrolledEnrollmentsMap, sequenceEnrollmentTokenErrorsMap) {
  return unenrolledEnrollmentsMap.filter(function (__enrollment, contactId) {
    return sequenceEnrollmentTokenErrorsMap.get(contactId) === 0;
  });
});
export var getFilteredContacts = createSelector([getUnenrolledContacts, getSearchText], function (unenrolledContacts, searchText) {
  if (!searchText) {
    return unenrolledContacts;
  }

  return unenrolledContacts.filter(function (contact) {
    var email = (getProperty(contact, 'email') || '').toLowerCase();
    var name = (formatName({
      firstName: getProperty(contact, 'firstname'),
      lastName: getProperty(contact, 'lastname'),
      email: email
    }) || '').toLowerCase();
    searchText = searchText.toLowerCase();
    return name.indexOf(searchText) > -1 || email.indexOf(searchText) > -1;
  });
});
export var getNextContactId = createSelector([getFilteredContacts, getSelectedContact], function (filteredContacts, selectedContact) {
  if (selectedContact === PRIMARY_SEQUENCE_ID) return null;
  var filteredContactIds = filteredContacts.keySeq().toList();
  var selectedContactIndex = filteredContactIds.indexOf(selectedContact);

  if (selectedContactIndex === filteredContactIds.size - 1) {
    return filteredContactIds.get(selectedContactIndex - 1);
  }

  return filteredContactIds.get(selectedContactIndex + 1);
});
export var getIsPrimarySequence = createSelector([getSelectedContact], function (selectedContact) {
  return selectedContact === PRIMARY_SEQUENCE_ID;
});
export var getSelectedEnrollmentDependencies = createSelector([getSelectedSequenceEnrollmentRecord], function (sequenceEnrolment) {
  return sequenceEnrolment.get('steps').filterNot(function (step) {
    return step.get('dependencies').isEmpty();
  }).reduce(function (dependencies, step) {
    var reliesOnStepOrder = step.get('stepOrder') - 1;
    var dependency = step.get('dependencies').first();
    var dependencyType = dependency.get('dependencyType');
    return dependencies.set(reliesOnStepOrder, dependencyType);
  }, ImmutableMap());
});
export var getStepsWithSendTimeErrors = createSelector(getSendTimeData, function (sendTimeData) {
  return sendTimeData.get('errors');
});
export var getSendLimits = createSelector(getSendTimeData, function (sendTimeData) {
  return sendTimeData.get('sendLimits');
});
export var getHasSendLimitDataForStepsWithErrors = createSelector([getStepsWithSendTimeErrors, getSendLimits], function (stepsWithSendTimeErrors, sendLimits) {
  return stepsWithSendTimeErrors.every(function (_errorType, stepIndex) {
    return sendLimits.find(function (limitData) {
      return limitData.get('stepNumber') - 1 === stepIndex;
    });
  });
});
export var getFirstStepWithCloseToSendLimitWarning = createSelector(getSendLimits, function (sendLimits) {
  return sendLimits.sortBy(function (value, key) {
    return key;
  }).findEntry(function (step) {
    return step.get('availableSendsUntilMidnight') <= 100;
  });
});
export var getIsFirstStepWithCloseToSendLimitWarningToday = createSelector([getFirstStepWithCloseToSendLimitWarning, getSelectedSequenceEnrollmentRecord], function (firstStepWithCloseToSendLimitWarning, selectedSequenceEnrollment) {
  if (!firstStepWithCloseToSendLimitWarning) return false;
  if (!selectedSequenceEnrollment) return false;

  var _firstStepWithCloseTo = _slicedToArray(firstStepWithCloseToSendLimitWarning, 1),
      stepTimestamp = _firstStepWithCloseTo[0];

  return isSameDay(Number(stepTimestamp), selectedSequenceEnrollment.timezone);
});
export var getSendTimeAlertType = createSelector([getStepsWithSendTimeErrors, getFirstStepWithCloseToSendLimitWarning], function (stepsWithSendTimeErrors, firstStepWithCloseToSendLimitWarning) {
  if (stepsWithSendTimeErrors.contains(SendTimesNotAvailableReasons.SEND_LIMIT_EXCEEDED)) {
    return SendTimeAlertWarningTypes.AT_SEND_LIMIT;
  } else if (stepsWithSendTimeErrors.contains(SendTimesNotAvailableReasons.THROTTLED)) {
    return SendTimeAlertWarningTypes.NO_TIME_SLOTS;
  } else if (firstStepWithCloseToSendLimitWarning) {
    return SendTimeAlertWarningTypes.CLOSE_TO_SEND_LIMIT;
  }

  return '';
});
export var getOriginalEditedEnrollment = createSelector([getSalesModalInterface], function (salesModalInterface) {
  return salesModalInterface.enrolledSequence;
});
export var getRecommendedSendTimes = function getRecommendedSendTimes(state) {
  return state.enrollmentState.sendTimeData.get('recommendedSendTimes');
};
export var getStepErrorTypes = createSelector([getSelectedSequenceEnrollmentRecord, getStepsWithSendTimeErrors], function (sequenceEnrollment, stepsWithSendTimeErrors) {
  return getErrorTypes({
    sequenceEnrollment: sequenceEnrollment,
    stepsWithSendTimeErrors: stepsWithSendTimeErrors
  });
});
export var getSequenceEnrollmentHasErrors = createSelector([getSelectedSequenceEnrollmentRecord, getStepErrorTypes], function (sequenceEnrollment, erroringSteps) {
  return hasErrors({
    sequenceEnrollment: sequenceEnrollment,
    erroringSteps: erroringSteps
  });
});
export var getSequenceEnrollmentIsUploadingImage = createSelector([getSelectedSequenceEnrollmentRecord], function (sequenceEnrollment) {
  return sequenceEnrollment.get('steps').some(function (step) {
    var body = step.getIn(['actionMeta', 'templateMeta', 'body']);

    if (body && body.getCurrentContent) {
      return body.getCurrentContent().getBlockMap().some(function (block) {
        return block.getIn(['data', 'image', 'isTemporary'], false);
      });
    }

    return false;
  });
});