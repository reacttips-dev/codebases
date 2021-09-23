'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Record;

import { Record } from 'immutable';
import { MESSAGE_TYPE_ID, ACTIVELY_PUBLISHING } from '../constants/messageTypes';
var ActivelyPublishing = Record((_Record = {}, _defineProperty(_Record, MESSAGE_TYPE_ID, ACTIVELY_PUBLISHING), _defineProperty(_Record, "threadId", null), _defineProperty(_Record, "channel", null), _defineProperty(_Record, "message", null), _Record), 'ActivelyPublishing');
export default ActivelyPublishing;