'use es6';

import { Record, List } from 'immutable';
import StepReportRecord from './StepReportRecord';
var ReportRecord = Record({
  total: 0,
  opensPerEnroll: 0,
  clicksPerEnroll: 0,
  repliesPerEnroll: 0,
  meetingsBookedPerEnroll: 0,
  unsubscribesPerEnroll: 0,
  bouncesPerEnroll: 0,
  steps: List()
}, 'ReportRecord');

ReportRecord.fromApi = function (data) {
  return new ReportRecord(data.update('steps', function (steps) {
    return steps.map(function (step) {
      return new StepReportRecord(step);
    });
  }));
};

export default ReportRecord;