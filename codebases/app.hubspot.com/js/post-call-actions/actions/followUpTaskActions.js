'use es6';

import { createAsyncAction } from 'conversations-async-data/async-action/createAsyncAction';
import I18n from 'I18n';
import { CREATE_TASK_ENGAGEMENT } from './asyncActionTypes';
import { requestFn } from '../clients/followUpTaskClient';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';
import { createCreatedFollowupTaskMessage } from 'calling-internal-common/iframe-events/internalEventMessageCreators';
export var createFollowUpTask = createAsyncAction({
  actionTypes: CREATE_TASK_ENGAGEMENT,
  requestFn: requestFn,
  failureMetaActionCreator: function failureMetaActionCreator(_ref) {
    var requestArgs = _ref.requestArgs;
    requestArgs.context.sendNotification({
      message: I18n.text('follow-up-task.onSaveFailure.message'),
      titleText: I18n.text('follow-up-task.onSaveFailure.title'),
      notificationType: 'warning'
    });
  },
  successMetaActionCreator: function successMetaActionCreator(_ref2) {
    var data = _ref2.data,
        requestArgs = _ref2.requestArgs;
    var engagementId = data && data.objectId;
    requestArgs.context.sendNotification({
      message: I18n.text('follow-up-task.onSaveSuccess.message'),
      titleText: I18n.text('follow-up-task.onSaveSuccess.title'),
      notificationType: 'success'
    });
    var message = createCreatedFollowupTaskMessage(engagementId);
    requestArgs.context.postMessageToHost(message);
    CommunicatorLogger.log('communicatorUsage_createFollowUpTask', {
      activity: 'CALL',
      channel: 'outbound call',
      source: 'communicator'
    });
  },
  toRecordFn: function toRecordFn(data) {
    return data;
  }
});