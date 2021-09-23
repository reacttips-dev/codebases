'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import * as Tasks from './Tasks';
import * as Templates from './Templates';
import { daysToMilliseconds, createTaskNode, createTemplateNode, createFinishNode } from './libraryUtils';
var delays = [0, daysToMilliseconds(1), daysToMilliseconds(2), daysToMilliseconds(2), 0, 0];
var ReEngagementEmail = createTemplateNode(Templates.ReEngagementEmail, delays[0]);
var CallAndLeaveVoicemailStep2 = createTaskNode(Tasks.CallAndLeaveVoicemail, delays[1]);
var ReEngagementEmail2 = createTemplateNode(Templates.ReEngagementEmail2, delays[2]);
var CallAndLeaveVoicemailStep4 = createTaskNode(Tasks.CallAndLeaveVoicemail, delays[3]);
var ReEngagementEmail3 = createTaskNode(Object.assign({}, Tasks.SendFollowUpEmail, {
  templateData: Templates.ReEngagementEmail3
}), delays[4]);
export default (function () {
  return ImmutableMap({
    delays: List(delays),
    steps: List([ReEngagementEmail(), CallAndLeaveVoicemailStep2(), ReEngagementEmail2(), CallAndLeaveVoicemailStep4(), ReEngagementEmail3(), createFinishNode()])
  });
});