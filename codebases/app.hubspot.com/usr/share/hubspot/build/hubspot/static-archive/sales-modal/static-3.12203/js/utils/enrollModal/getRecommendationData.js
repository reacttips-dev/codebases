'use es6';

import { List } from 'immutable';
import { SEND_TEMPLATE } from 'sales-modal/constants/SequenceStepTypes';

var convertTimeOfDayToTimestamp = function convertTimeOfDayToTimestamp(timeOfDay, stepMoment, timezone) {
  return stepMoment.clone().tz(timezone).startOf('day').add(timeOfDay, 'minutes').valueOf();
};

var getEmailProperty = function getEmailProperty(step, property) {
  return step.getIn(['actionMeta', 'templateMeta', property]).getCurrentContent().getPlainText().trim();
};

var getRecommendationDataFromStep = function getRecommendationDataFromStep(_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      step = _ref.step,
      getAbsoluteTime = _ref.getAbsoluteTime;
  var timezone = sequenceEnrollment.get('timezone');
  var emailNumber = step.get('stepOrder');

  var _getAbsoluteTime = getAbsoluteTime(sequenceEnrollment, emailNumber),
      stepMoment = _getAbsoluteTime.stepMoment;

  var startTimeRange = sequenceEnrollment.sequenceSettings.sendWindowStartsAtMin;
  var endTimeRange = sequenceEnrollment.sequenceSettings.sendWindowEndsAtMin;
  return {
    emailNumber: emailNumber,
    subjectLength: getEmailProperty(step, 'subject').length,
    bodyLength: getEmailProperty(step, 'body').length,
    startTime: convertTimeOfDayToTimestamp(startTimeRange, stepMoment, timezone),
    endTime: convertTimeOfDayToTimestamp(endTimeRange, stepMoment, timezone)
  };
};

export default (function (_ref2) {
  var sequenceEnrollment = _ref2.sequenceEnrollment,
      getAbsoluteTime = _ref2.getAbsoluteTime;
  return sequenceEnrollment.get('steps').filter(function (step) {
    return step.get('action') === SEND_TEMPLATE;
  }).reduce(function (data, step) {
    if (!step.getIn(['actionMeta', 'templateMeta', 'body'])) {
      return data;
    }

    return data.push(getRecommendationDataFromStep({
      sequenceEnrollment: sequenceEnrollment,
      step: step,
      getAbsoluteTime: getAbsoluteTime
    }));
  }, List()).toJS();
});