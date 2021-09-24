'use es6';

import I18n from 'I18n';
import * as SequencesApi from 'sales-modal/api/SequencesApi';
import { FINISH_ENROLLMENT } from 'sales-modal/constants/SequenceStepTypes';
import pipe from 'transmute/pipe';
import getFirstEditableStepIndex from 'sales-modal/utils/enrollModal/getFirstEditableStepIndex';
import convertStepContentToHTML from 'sales-modal/utils/enrollModal/convertStepContentToHTML';
import removeSendTimeRecommendationCorrelationIds from 'sales-modal/utils/enrollModal/removeSendTimeRecommendationCorrelationIds';
import validateStepDependencies from 'sales-modal/utils/enrollModal/validateStepDependencies';
import validateTimestamps from 'sales-modal/utils/enrollModal/validateTimestamps';
var NO_ABSOLUTE_TIME = 0;

var getTimeOfDayFromTimestamp = function getTimeOfDayFromTimestamp(moment) {
  return moment.diff(moment.clone().startOf('day'));
};

var updateEnrollmentWithSendTimeData = function updateEnrollmentWithSendTimeData(_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      sendTimeData = _ref.sendTimeData,
      enrollmentIndex = _ref.enrollmentIndex;
  var previousAbsoluteTime;
  var previousTimeOfDay;
  var firstEditableStepIndex = getFirstEditableStepIndex(sequenceEnrollment);
  var timezone = sequenceEnrollment.get('timezone');
  return sequenceEnrollment.update('steps', function (steps) {
    var stepsWithAbsoluteTimes = steps.map(function (step, index) {
      if (step.get('stepOrder') < firstEditableStepIndex) {
        // BE validation temporarily prevents us from giving skipped
        // steps an absolute time of null
        // Can clean up after that is fixed
        return step.set('absoluteTime', NO_ABSOLUTE_TIME);
      } // We need to make sure the finish step's absolute time is not earlier than
      // the previous step's time


      if (step.get('action') === FINISH_ENROLLMENT) {
        return step.set('absoluteTime', previousAbsoluteTime).set('timeOfDay', previousTimeOfDay);
      }

      var stepData = sendTimeData.get('stepSendTimesResponses') && sendTimeData.get('stepSendTimesResponses').find(function (stepResponse) {
        return stepResponse.get('stepOrder') === index;
      });

      if (!stepData) {
        if (step.get('absoluteTime') < previousAbsoluteTime) {
          return step.set('absoluteTime', previousAbsoluteTime).set('timeOfDay', previousTimeOfDay);
        }

        previousAbsoluteTime = step.get('absoluteTime');
        return step;
      }

      var originalTimestamp = step.get('absoluteTime');
      var newMoment = I18n.moment(stepData.getIn(['availableTimesMillis', enrollmentIndex])).tz(timezone);
      var timeOfDay = getTimeOfDayFromTimestamp(newMoment);
      previousAbsoluteTime = newMoment.valueOf();
      previousTimeOfDay = timeOfDay;
      return step.set('absoluteTime', newMoment.valueOf()).set('timeOfDay', timeOfDay).setIn(['actionMeta', 'templateMeta', 'preferredAbsoluteTime'], originalTimestamp);
    });
    return stepsWithAbsoluteTimes;
  });
};

export default (function (_ref2) {
  var sequenceEnrollments = _ref2.sequenceEnrollments,
      originalEnrollment = _ref2.originalEnrollment,
      recommendedSendTimes = _ref2.recommendedSendTimes,
      enrollType = _ref2.enrollType;
  sequenceEnrollments = sequenceEnrollments.map(function (sequenceEnrollment) {
    return validateTimestamps({
      sequenceEnrollment: sequenceEnrollment,
      enrollType: enrollType
    });
  });
  var unprocessedSequenceEnrollment = sequenceEnrollments.first();
  var numTimes = sequenceEnrollments.size;
  return SequencesApi.fetchSendTimeData({
    numTimes: numTimes,
    sequenceEnrollment: unprocessedSequenceEnrollment,
    originalEnrollment: originalEnrollment
  }).then(function (sendTimeData) {
    var enrollmentIndex = 0;
    return sequenceEnrollments.map(function (enrollmentToProcess) {
      return pipe(function (sequenceEnrollment) {
        var ret = updateEnrollmentWithSendTimeData({
          sequenceEnrollment: sequenceEnrollment,
          sendTimeData: sendTimeData,
          enrollmentIndex: enrollmentIndex
        });
        enrollmentIndex++;
        return ret;
      }, validateStepDependencies, convertStepContentToHTML, function (sequenceEnrollment) {
        return removeSendTimeRecommendationCorrelationIds({
          sequenceEnrollment: sequenceEnrollment,
          recommendedSendTimes: recommendedSendTimes
        });
      })(enrollmentToProcess);
    });
  }, function (err) {
    throw err;
  });
});