'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Record;

import { Record } from 'immutable';
import { MESSAGE_TYPE_ID, FAILED_TO_PUBLISH } from '../constants/messageTypes';
var FailedToPublish = Record((_Record = {}, _defineProperty(_Record, MESSAGE_TYPE_ID, FAILED_TO_PUBLISH), _defineProperty(_Record, "threadId", null), _defineProperty(_Record, "channel", null), _defineProperty(_Record, "message", null), _defineProperty(_Record, "allowRetry", true), _Record), 'FailedToPublish');
export default FailedToPublish;