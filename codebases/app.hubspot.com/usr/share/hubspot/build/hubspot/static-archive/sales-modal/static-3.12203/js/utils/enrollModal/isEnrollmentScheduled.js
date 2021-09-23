'use es6';

import I18n from 'I18n';
import getAbsoluteTime from './getAbsoluteTime';
export default (function (sequenceEnrollment) {
  var startingStepOrder = sequenceEnrollment.get('startingStepOrder');
  var enrollTime = (sequenceEnrollment.get('enrolledAt') ? I18n.moment(sequenceEnrollment.get('enrolledAt')) : I18n.moment()).valueOf();
  var firstStepAbsoluteTime = getAbsoluteTime(sequenceEnrollment, startingStepOrder).absoluteTime;
  return firstStepAbsoluteTime > enrollTime;
});