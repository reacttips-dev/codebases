'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import * as Tasks from './Tasks';
import * as Templates from './Templates';
import { daysToMilliseconds, createTaskNode, createTemplateNode, createFinishNode } from './libraryUtils';
var delays = [0, daysToMilliseconds(1), 0, daysToMilliseconds(3), daysToMilliseconds(5), 0];
var ProductDemoEmail = createTemplateNode(Templates.ProductDemoEmail, delays[0]);
var FollowUpCallDemoRequest = createTaskNode(Tasks.FollowUpCallDemoRequest, delays[1]);
var ProductDemoEmail2 = createTaskNode(Object.assign({}, Tasks.SendFollowUpEmail, {
  templateData: Templates.ProductDemoEmail2
}), delays[2]);
var ProductDemoEmail3 = createTemplateNode(Templates.ProductDemoEmail3, delays[3]);
var SequenceCompleted = createTaskNode(Tasks.SequenceCompleted, delays[4]);
export default (function () {
  return ImmutableMap({
    delays: List(delays),
    steps: List([ProductDemoEmail(), FollowUpCallDemoRequest(), ProductDemoEmail2(), ProductDemoEmail3(), SequenceCompleted(), createFinishNode()])
  });
});