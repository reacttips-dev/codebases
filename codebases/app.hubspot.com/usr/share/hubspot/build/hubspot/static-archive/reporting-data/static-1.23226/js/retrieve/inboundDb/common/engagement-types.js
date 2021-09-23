'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { Map as ImmutableMap } from 'immutable';
import * as DataTypes from '../../../constants/dataTypes';
export var dataTypeToEngagementType = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, DataTypes.CALLS, 'CALL'), _defineProperty(_ImmutableMap, DataTypes.CONVERSATIONS, 'CONVERSATION_SESSION'), _defineProperty(_ImmutableMap, DataTypes.ENGAGEMENT_EMAILS, 'EMAIL'), _defineProperty(_ImmutableMap, DataTypes.MEETINGS, 'MEETING'), _defineProperty(_ImmutableMap, DataTypes.NOTES, 'NOTE'), _defineProperty(_ImmutableMap, DataTypes.TASKS, 'TASK'), _defineProperty(_ImmutableMap, DataTypes.FEEDBACK, 'FEEDBACK_SUBMISSION'), _ImmutableMap));