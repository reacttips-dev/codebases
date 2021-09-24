'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import * as Tasks from './Tasks';
import * as Templates from './Templates';
import { daysToMilliseconds, createTaskNode, createTemplateNode, createFinishNode } from './libraryUtils';
var delays = [0, daysToMilliseconds(2), daysToMilliseconds(2), 0, daysToMilliseconds(2), daysToMilliseconds(2), 0, daysToMilliseconds(5), 0];
var MeetingFollowUpEmail = createTemplateNode(Templates.MeetingFollowUpEmail, delays[0]);
var MeetingFollowUpEmail2 = createTaskNode(Object.assign({}, Tasks.SendFollowUpEmail, {
  templateData: Templates.MeetingFollowUpEmail2
}), delays[1]);
var CallAndLeaveVoicemailStep3 = createTaskNode(Tasks.CallAndLeaveVoicemail, delays[2]);
var MeetingFollowUpEmail3 = createTaskNode(Object.assign({}, Tasks.SendFollowUpEmail, {
  templateData: Templates.MeetingFollowUpEmail3
}), delays[3]);
var MeetingFollowUpEmail4 = createTemplateNode(Templates.MeetingFollowUpEmail4, delays[4]);
var CallAndLeaveVoicemailStep6 = createTaskNode(Tasks.CallAndLeaveVoicemail, delays[5]);
var MeetingFollowUpEmail5 = createTaskNode(Object.assign({}, Tasks.SendFollowUpEmail, {
  templateData: Templates.MeetingFollowUpEmail5
}), delays[6]);
var SequenceCompleted = createTaskNode(Tasks.SequenceCompleted, delays[7]);
export default (function () {
  return ImmutableMap({
    delays: List(delays),
    steps: List([MeetingFollowUpEmail(), MeetingFollowUpEmail2(), CallAndLeaveVoicemailStep3(), MeetingFollowUpEmail3(), MeetingFollowUpEmail4(), CallAndLeaveVoicemailStep6(), MeetingFollowUpEmail5(), SequenceCompleted(), createFinishNode()])
  });
});