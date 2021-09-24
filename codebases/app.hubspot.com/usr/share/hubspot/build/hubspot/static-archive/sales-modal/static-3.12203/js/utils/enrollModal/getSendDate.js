'use es6';

import I18n from 'I18n';
import memoize from 'transmute/memoize';
var getSendDate = memoize(function (sequenceEnrollment) {
  var startingStepOrder = sequenceEnrollment.startingStepOrder;
  var estimatedCompletionDelay = sequenceEnrollment.getIn(['steps', startingStepOrder, 'previousStepEstimatedCompletionCalendarDaysDelay'], 0);
  return sequenceEnrollment.get('enrolledAt') ? I18n.moment(sequenceEnrollment.get('enrolledAt')).add(estimatedCompletionDelay, 'ms') : I18n.moment();
});
export default getSendDate;