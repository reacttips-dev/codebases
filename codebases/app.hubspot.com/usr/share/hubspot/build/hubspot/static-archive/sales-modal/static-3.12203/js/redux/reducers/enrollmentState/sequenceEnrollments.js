'use es6';

import omit from 'transmute/omit';
import { ENROLLMENT_STATE_INIT, ENROLLMENT_STATE_REMOVE_CONTACTS, ENROLLMENT_STATE_ENROLLMENT_INIT, SELECT_SENDER, ENROLLMENT_STATE_SINGLE_ENROLLMENT_SUCCEEDED, ENROLLMENT_STATE_BULK_ENROLLMENT_SUCCEEDED } from '../../actionTypes';
import { SET_TIMEZONE, SET_STARTING_STEP_ORDER, SET_STEP_DELAY, SET_FIRST_SEND_TYPE, SET_TIME_OF_DAY, TOGGLE_STEP_DEPENDENCY, SET_UNSUBSCRIBE_LINKS, SET_STEP_METADATA, SET_MERGE_TAGS, SET_RECOMMENDED_SEND_TIMES, APPLY_ENROLLMENT_SETTINGS } from '../../enrollmentEditActionTypes';
import setTimezone from '../../utils/setTimezone';
import setEnrollmentStartingOrder from '../../utils/setEnrollmentStartingOrder';
import setStepDelay from '../../utils/setStepDelay';
import setFirstSendType from '../../utils/setFirstSendType';
import setTimeOfDayForStep from '../../utils/setTimeOfDayForStep';
import toggleStepDependency from '../../utils/toggleStepDependency';
import setUnsubscribeLinks from '../../utils/setUnsubscribeLinks';
import setStepMetadata from '../../utils/setStepMetadata';
import setMergeTags from '../../utils/setMergeTags';
import setEmailSendTimesFromRecommendations from '../../utils/setEmailSendTimesFromRecommendations';
import setSendOptions from '../../utils/setSendOptions';
import setEmailAddress from 'sales-modal/redux/utils/setEmailAddress';
var initialState = null;
export default function enrollments() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ENROLLMENT_STATE_INIT:
      return action.payload.contacts.map(function () {
        return null;
      });

    case ENROLLMENT_STATE_ENROLLMENT_INIT:
      return action.payload.sequenceEnrollments.reduce(function (acc, sequenceEnrollment, contactId) {
        return acc.set(contactId, sequenceEnrollment);
      }, state);

    case SET_TIMEZONE:
      {
        var _action$payload = action.payload,
            enrollType = _action$payload.enrollType,
            timezone = _action$payload.timezone;
        return state.map(function (sequenceEnrollment) {
          return setTimezone({
            sequenceEnrollment: sequenceEnrollment,
            timezone: timezone,
            enrollType: enrollType
          });
        });
      }

    case SET_STARTING_STEP_ORDER:
      {
        var startingStepOrder = action.payload.startingStepOrder;
        return state.map(function (sequenceEnrollment) {
          return setEnrollmentStartingOrder({
            sequenceEnrollment: sequenceEnrollment,
            startingStepOrder: startingStepOrder
          });
        });
      }

    case SET_STEP_DELAY:
      {
        var _action$payload2 = action.payload,
            delay = _action$payload2.delay,
            step = _action$payload2.step;
        return state.map(function (sequenceEnrollment) {
          return setStepDelay({
            sequenceEnrollment: sequenceEnrollment,
            step: step,
            delay: delay
          });
        });
      }

    case SET_FIRST_SEND_TYPE:
      {
        var _action$payload3 = action.payload,
            firstSendType = _action$payload3.firstSendType,
            _enrollType = _action$payload3.enrollType;
        return state.map(function (sequenceEnrollment) {
          return setFirstSendType({
            sequenceEnrollment: sequenceEnrollment,
            firstSendType: firstSendType,
            enrollType: _enrollType
          });
        });
      }

    case SET_TIME_OF_DAY:
      {
        var _action$payload4 = action.payload,
            timeValue = _action$payload4.timeValue,
            _step = _action$payload4.step;
        return state.map(function (sequenceEnrollment) {
          return setTimeOfDayForStep({
            sequenceEnrollment: sequenceEnrollment,
            step: _step,
            timeValue: timeValue
          });
        });
      }

    case TOGGLE_STEP_DEPENDENCY:
      {
        var _action$payload5 = action.payload,
            requiredByStepOrder = _action$payload5.requiredByStepOrder,
            reliesOnStepOrder = _action$payload5.reliesOnStepOrder,
            dependencyType = _action$payload5.dependencyType;
        return state.map(function (sequenceEnrollment) {
          return toggleStepDependency({
            sequenceEnrollment: sequenceEnrollment,
            requiredByStepOrder: requiredByStepOrder,
            reliesOnStepOrder: reliesOnStepOrder,
            dependencyType: dependencyType
          });
        });
      }

    case SET_UNSUBSCRIBE_LINKS:
      {
        var _action$payload6 = action.payload,
            selectedContact = _action$payload6.selectedContact,
            blockData = _action$payload6.blockData;
        return state.set(selectedContact, setUnsubscribeLinks({
          sequenceEnrollment: state.get(selectedContact),
          blockData: blockData
        }));
      }

    case SET_STEP_METADATA:
      {
        var _action$payload7 = action.payload,
            _selectedContact = _action$payload7.selectedContact,
            _step2 = _action$payload7.step,
            metadata = _action$payload7.metadata,
            isSubjectChange = _action$payload7.isSubjectChange;
        return state.set(_selectedContact, setStepMetadata({
          sequenceEnrollment: state.get(_selectedContact),
          step: _step2,
          metadata: metadata,
          isSubjectChange: isSubjectChange
        }));
      }

    case SET_MERGE_TAGS:
      {
        var _action$payload8 = action.payload,
            _selectedContact2 = _action$payload8.selectedContact,
            mergeTagInputFields = _action$payload8.mergeTagInputFields,
            erroringSteps = _action$payload8.erroringSteps;
        return state.set(_selectedContact2, setMergeTags({
          sequenceEnrollment: state.get(_selectedContact2),
          mergeTagInputFields: mergeTagInputFields,
          erroringSteps: erroringSteps
        }));
      }

    case SET_RECOMMENDED_SEND_TIMES:
      {
        var _action$payload9 = action.payload,
            _selectedContact3 = _action$payload9.selectedContact,
            sendTimeRecommendations = _action$payload9.sendTimeRecommendations;
        return state.set(_selectedContact3, setEmailSendTimesFromRecommendations({
          sequenceEnrollment: state.get(_selectedContact3),
          sendTimeRecommendations: sendTimeRecommendations
        }));
      }

    case APPLY_ENROLLMENT_SETTINGS:
      {
        return state.map(function (sequenceEnrollment) {
          return setSendOptions(Object.assign({
            sequenceEnrollment: sequenceEnrollment
          }, action.payload));
        });
      }

    case SELECT_SENDER:
      {
        var _action$payload10 = action.payload,
            fromAddress = _action$payload10.fromAddress,
            inboxAddress = _action$payload10.inboxAddress;
        return state.map(function (sequenceEnrollment) {
          return setEmailAddress({
            sequenceEnrollment: sequenceEnrollment,
            fromAddress: fromAddress,
            inboxAddress: inboxAddress
          });
        });
      }

    case ENROLLMENT_STATE_SINGLE_ENROLLMENT_SUCCEEDED:
      {
        var _action$payload11 = action.payload,
            contactId = _action$payload11.contactId,
            sequenceEnrollment = _action$payload11.sequenceEnrollment;
        var firstStepTimeOfDay = sequenceEnrollment.getIn(['steps', sequenceEnrollment.get('startingStepOrder'), 'timeOfDay']);
        return state.update(contactId, function (enrollmentToUpdate) {
          return enrollmentToUpdate.setIn(['steps', enrollmentToUpdate.get('startingStepOrder'), 'timeOfDay'], firstStepTimeOfDay);
        });
      }

    case ENROLLMENT_STATE_BULK_ENROLLMENT_SUCCEEDED:
      {
        return action.payload.sequenceEnrollments.reduce(function (acc, sequenceEnrollment, contactId) {
          var firstStepTimeOfDay = sequenceEnrollment.getIn(['steps', sequenceEnrollment.get('startingStepOrder'), 'timeOfDay']);
          return acc.update(contactId, function (enrollmentToUpdate) {
            return enrollmentToUpdate.setIn(['steps', enrollmentToUpdate.get('startingStepOrder'), 'timeOfDay'], firstStepTimeOfDay);
          });
        }, state);
      }

    case ENROLLMENT_STATE_REMOVE_CONTACTS:
      return omit(action.payload.contacts, state);

    default:
      return state;
  }
}