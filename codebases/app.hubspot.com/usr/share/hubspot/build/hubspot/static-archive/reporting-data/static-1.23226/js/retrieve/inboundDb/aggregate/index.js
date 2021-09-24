'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { Map as ImmutableMap } from 'immutable';
import * as DataType from '../../../constants/dataTypes';
import standardAggregate from './aggregate';
import crossObjectAggregate from './cross-object/aggregate';
import engagementAggregate from './engagement/aggregate';
var dataTypeToAggImpl = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, DataType.CROSS_OBJECT, crossObjectAggregate), _defineProperty(_ImmutableMap, DataType.CALLS, engagementAggregate), _defineProperty(_ImmutableMap, DataType.CONVERSATIONS, engagementAggregate), _defineProperty(_ImmutableMap, DataType.ENGAGEMENT_EMAILS, engagementAggregate), _defineProperty(_ImmutableMap, DataType.FEEDBACK, engagementAggregate), _defineProperty(_ImmutableMap, DataType.MEETINGS, engagementAggregate), _defineProperty(_ImmutableMap, DataType.NOTES, engagementAggregate), _defineProperty(_ImmutableMap, DataType.TASKS, engagementAggregate), _ImmutableMap));
export default function aggregate(config, properties, runtimeOptions) {
  var dataType = config.get('dataType');
  return dataTypeToAggImpl.get(dataType, standardAggregate)(config, properties, runtimeOptions);
}