'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import * as Tasks from './Tasks';
import * as Templates from './Templates';
import { daysToMilliseconds, createTaskNode, createTemplateNode, createFinishNode } from './libraryUtils';
var delays = [0, 0, daysToMilliseconds(3), daysToMilliseconds(4), 0, daysToMilliseconds(4), 0];
var TradeShowEmail = createTemplateNode(Templates.TradeShowEmail, delays[0]);
var ConnectOnLinkedIn = createTaskNode(Tasks.ConnectOnLinkedIn, delays[1]);
var TradeShowEmail2 = createTemplateNode(Templates.TradeShowEmail2, delays[2]);
var FollowUpCall = createTaskNode(Tasks.FollowUpCall, delays[3]);
var TradeShowEmail3 = createTaskNode(Object.assign({}, Tasks.SendFollowUpEmail, {
  templateData: Templates.TradeShowEmail3
}), delays[4]);
var SequenceCompleted = createTaskNode(Tasks.SequenceCompleted, delays[5]);
export default (function () {
  return ImmutableMap({
    delays: List(delays),
    steps: List([TradeShowEmail(), ConnectOnLinkedIn(), TradeShowEmail2(), FollowUpCall(), TradeShowEmail3(), SequenceCompleted(), createFinishNode()])
  });
});