'use es6';

import { Map as ImmutableMap } from 'immutable';
import { timestampToTimeOfDay } from 'sales-modal/utils/enrollModal/timeSelectorUtils';
import { SEND_TEMPLATE } from 'sales-modal/constants/SequenceStepTypes';

var updateTemplateSteps = function updateTemplateSteps(sequenceEnrollment, updateFn) {
  var steps = sequenceEnrollment.get('steps');
  var startingStepOrder = sequenceEnrollment.get('startingStepOrder');
  return steps.map(function (step, index) {
    if (index === startingStepOrder || step.get('action') !== SEND_TEMPLATE) {
      return step;
    }

    return updateFn(step);
  });
};

var setEmailSendTimesFromRecommendations = function setEmailSendTimesFromRecommendations(_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      sendTimeRecommendations = _ref.sendTimeRecommendations;
  var timezone = sequenceEnrollment.get('timezone');
  var recommendations = ImmutableMap(sendTimeRecommendations.map(function (recommendation) {
    return [recommendation.get('emailNumber'), recommendation];
  }));
  return updateTemplateSteps(sequenceEnrollment, function (step) {
    var emailNumber = step.get('stepOrder');

    var _recommendations$get$ = recommendations.get(emailNumber).toObject(),
        timestamp = _recommendations$get$.timestamp,
        correlationId = _recommendations$get$.correlationId;

    var updatedTimeOfDay = timestampToTimeOfDay(timestamp, timezone);
    return step.set('timeOfDay', updatedTimeOfDay).setIn(['actionMeta', 'templateMeta', 'sendTimeRecommendationCorrelationId'], correlationId);
  });
};

export default (function (_ref2) {
  var sequenceEnrollment = _ref2.sequenceEnrollment,
      sendTimeRecommendations = _ref2.sendTimeRecommendations;
  var stepsWithSendTimesFromRecommendations = setEmailSendTimesFromRecommendations({
    sendTimeRecommendations: sendTimeRecommendations,
    sequenceEnrollment: sequenceEnrollment
  });
  var correlationIdPath = ['actionMeta', 'templateMeta', 'sendTimeRecommendationCorrelationId'];
  return stepsWithSendTimesFromRecommendations.reduce(function (updatedEnrollment, step, stepIndex) {
    var enrollmentWithTimeOfDay = updatedEnrollment.setIn(['steps', stepIndex, 'timeOfDay'], step.get('timeOfDay'));

    if (step.hasIn(correlationIdPath)) {
      return enrollmentWithTimeOfDay.setIn(['steps', stepIndex, 'actionMeta', 'templateMeta', 'sendTimeRecommendationCorrelationId'], step.getIn(correlationIdPath));
    }

    return enrollmentWithTimeOfDay;
  }, sequenceEnrollment);
});