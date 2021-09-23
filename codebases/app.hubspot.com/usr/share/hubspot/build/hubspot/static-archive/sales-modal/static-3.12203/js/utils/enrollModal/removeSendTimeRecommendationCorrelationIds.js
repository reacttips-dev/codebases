'use es6';

import I18n from 'I18n';
import { SEND_TEMPLATE } from 'sales-modal/constants/SequenceStepTypes';
var RECOMMENDED_BUFFER_TIME = 5 * 60000; // 5 minutes

export default function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      recommendedSendTimes = _ref.recommendedSendTimes;
  var correlationIdPath = ['actionMeta', 'templateMeta', 'sendTimeRecommendationCorrelationId'];

  if (!recommendedSendTimes.size) {
    return sequenceEnrollment;
  }

  return sequenceEnrollment.update('steps', function (steps) {
    return steps.map(function (step, index) {
      if (index < sequenceEnrollment.startingStepOrder || // BE does not send back data for skipped steps
      step.get('action') !== SEND_TEMPLATE) {
        return step;
      }

      var recommendationData = recommendedSendTimes.find(function (sendTime) {
        return sendTime.get('emailNumber') === step.get('stepOrder');
      });
      var recommendedMoment = I18n.moment(recommendationData.get('timestamp')).tz(sequenceEnrollment.timezone);
      var stepMoment = I18n.moment(step.get('absoluteTime')).tz(sequenceEnrollment.timezone);

      if (Math.abs(recommendedMoment.diff(stepMoment)) > RECOMMENDED_BUFFER_TIME) {
        return step.removeIn(correlationIdPath);
      }

      return step;
    });
  });
}