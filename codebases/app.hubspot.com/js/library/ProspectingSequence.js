'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import * as Tasks from './Tasks';
import * as Templates from './Templates';
import { daysToMilliseconds, createTaskNode, createTemplateNode, createFinishNode } from './libraryUtils';
var delays = [0, 0, daysToMilliseconds(2), daysToMilliseconds(2), daysToMilliseconds(2), 0, daysToMilliseconds(5), 0];
var CallFirstTouch = createTaskNode(Tasks.CallFirstTouch, delays[0]);
var ProspectingEmail = createTaskNode(Object.assign({}, Tasks.SendFollowUpEmail, {
  templateData: Templates.ProspectingEmail
}), delays[1]);
var CallSecondCall = createTaskNode(Tasks.CallSecondCall, delays[2]);
var ProspectingEmail2 = createTemplateNode(Templates.ProspectingEmail2, delays[3]);
var CallThirdCall = createTaskNode(Tasks.CallThirdCall, delays[4]);
var ProspectingEmail3 = createTaskNode(Object.assign({}, Tasks.SendFollowUpEmail, {
  templateData: Templates.ProspectingEmail3
}), delays[5]);
var SequenceCompleted = createTaskNode(Tasks.SequenceCompleted, delays[6]);
export default (function () {
  return ImmutableMap({
    delays: List(delays),
    steps: List([CallFirstTouch(), ProspectingEmail(), CallSecondCall(), ProspectingEmail2(), CallThirdCall(), ProspectingEmail3(), SequenceCompleted(), createFinishNode()])
  });
});