'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import * as Tasks from './Tasks';
import * as Templates from './Templates';
import { daysToMilliseconds, createTaskNode, createTemplateNode, createFinishNode } from './libraryUtils';
var delays = [0, daysToMilliseconds(1), 0, daysToMilliseconds(3), daysToMilliseconds(3), 0, daysToMilliseconds(5), 0];
var RescheduleMeetingEmail = createTemplateNode(Templates.RescheduleMeetingEmail, delays[0]);
var CallAndReschedule = createTaskNode(Tasks.CallAndReschedule, delays[1]);
var RescheduleMeetingEmail2 = createTaskNode(Object.assign({}, Tasks.SendFollowUpEmail, {
  templateData: Templates.RescheduleMeetingEmail2
}), delays[2]);
var RescheduleMeetingEmail3 = createTemplateNode(Templates.RescheduleMeetingEmail3, delays[3]);
var CallAndLeaveVoicemail = createTaskNode(Tasks.CallAndLeaveVoicemail, delays[4]);
var RescheduleMeetingEmail4 = createTaskNode(Object.assign({}, Tasks.SendFollowUpEmail, {
  templateData: Templates.RescheduleMeetingEmail4
}), delays[5]);
var SequenceCompleted = createTaskNode(Tasks.SequenceCompleted, delays[6]);
export default (function () {
  return ImmutableMap({
    delays: List(delays),
    steps: List([RescheduleMeetingEmail(), CallAndReschedule(), RescheduleMeetingEmail2(), RescheduleMeetingEmail3(), CallAndLeaveVoicemail(), RescheduleMeetingEmail4(), SequenceCompleted(), createFinishNode()])
  });
});