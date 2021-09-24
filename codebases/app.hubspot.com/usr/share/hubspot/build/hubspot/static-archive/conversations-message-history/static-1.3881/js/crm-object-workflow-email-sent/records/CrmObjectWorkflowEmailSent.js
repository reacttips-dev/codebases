'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Record;

import { Record } from 'immutable';
import { MESSAGE_TYPE_ID, CRM_OBJECT_WORKFLOW_EMAIL_SENT } from '../constants/messageTypes';
var CrmObjectWorkflowEmailSent = Record((_Record = {}, _defineProperty(_Record, MESSAGE_TYPE_ID, CRM_OBJECT_WORKFLOW_EMAIL_SENT), _defineProperty(_Record, "emailMessageId", null), _defineProperty(_Record, "emailSubject", null), _defineProperty(_Record, "id", null), _defineProperty(_Record, "messageDeletedStatus", null), _defineProperty(_Record, "objectId", null), _defineProperty(_Record, "objectType", null), _defineProperty(_Record, "timestamp", null), _defineProperty(_Record, "workflowId", null), _defineProperty(_Record, "recipientVid", null), _Record), 'CrmObjectWorkflowEmailSent');
export default CrmObjectWorkflowEmailSent;