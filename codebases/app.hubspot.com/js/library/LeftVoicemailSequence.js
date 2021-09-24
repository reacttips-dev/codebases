'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import * as Tasks from './Tasks';
import * as Templates from './Templates';
import { daysToMilliseconds, createTaskNode, createTemplateNode, createFinishNode } from './libraryUtils';
var delays = [0, daysToMilliseconds(3), daysToMilliseconds(3), 0, daysToMilliseconds(3), daysToMilliseconds(5), 0];
var LeftVoicemailEmail = createTemplateNode(Templates.LeftVoicemailEmail, delays[0]);
var LeftVoicemailEmail2 = createTemplateNode(Templates.LeftVoicemailEmail2, delays[1]);
var CallAndLeaveVoicemail = createTaskNode(Tasks.CallAndLeaveVoicemail, delays[2]);
var LeftVoicemailEmail3 = createTaskNode(Object.assign({}, Tasks.SendFollowUpEmail, {
  templateData: Templates.LeftVoicemailEmail3
}), delays[3]);
var LeftVoicemailEmail4 = createTemplateNode(Templates.LeftVoicemailEmail4, delays[4]);
var SequenceCompleted = createTaskNode(Tasks.SequenceCompleted, delays[5]);
export default (function () {
  return ImmutableMap({
    delays: List(delays),
    steps: List([LeftVoicemailEmail(), LeftVoicemailEmail2(), CallAndLeaveVoicemail(), LeftVoicemailEmail3(), LeftVoicemailEmail4(), SequenceCompleted(), createFinishNode()])
  });
});