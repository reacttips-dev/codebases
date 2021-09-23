'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import * as Tasks from './Tasks';
import * as Templates from './Templates';
import { daysToMilliseconds, createTaskNode, createTemplateNode, createFinishNode } from './libraryUtils';
var delays = [0, daysToMilliseconds(2), 0, daysToMilliseconds(3), daysToMilliseconds(1), 0];
var RecentConversionEmail = createTemplateNode(Templates.RecentConversionEmail, delays[0]);
var FollowUpCall = createTaskNode(Tasks.FollowUpCall, delays[1]);
var RecentConversionEmail2 = createTaskNode(Object.assign({}, Tasks.SendFollowUpEmail, {
  templateData: Templates.RecentConversionEmail2
}), delays[2]);
var RecentConversionEmail3 = createTemplateNode(Templates.RecentConversionEmail3, delays[3]);
var SequenceCompleted = createTaskNode(Tasks.SequenceCompleted, delays[4]);
export default (function () {
  return ImmutableMap({
    delays: List(delays),
    steps: List([RecentConversionEmail(), FollowUpCall(), RecentConversionEmail2(), RecentConversionEmail3(), SequenceCompleted(), createFinishNode()])
  });
});