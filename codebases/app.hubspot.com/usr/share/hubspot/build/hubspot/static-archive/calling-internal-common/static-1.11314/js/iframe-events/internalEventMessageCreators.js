'use es6';

import * as internalEventTypes from './InternalIframeEventTypes';
/**
 * If any updates are made the the content or naming of these events make sure to bump the version:
 * calling-internal-common/constants/twilioWidgetOptions => WIDGET_MESSAGE_VERSION
 * this will avoid user issues when using the app.
 */

/**
 * HOST -> IFRAME
 */

export var createStartCallMessage = function createStartCallMessage(dialNumberPayload) {
  return {
    type: internalEventTypes.START_CALL_HOST_MSG,
    data: Object.assign({}, dialNumberPayload, {
      startCallTime: new Date().getTime()
    })
  };
};
export var createEndCallMessage = function createEndCallMessage(_ref) {
  var isQueueTask = _ref.isQueueTask;
  return {
    type: internalEventTypes.END_CALL_HOST_MSG,
    data: {
      isQueueTask: isQueueTask
    }
  };
};
export var createDiscardFollowupTaskMessage = function createDiscardFollowupTaskMessage() {
  return {
    type: internalEventTypes.DISCARD_FOLLOW_UP_TASK_HOST_MSG
  };
};
export var createResetMessage = function createResetMessage() {
  return {
    type: internalEventTypes.RESET_WIDGET_HOST_MSG
  };
};
export var createConfirmWidgetResetRequest = function createConfirmWidgetResetRequest() {
  return {
    type: internalEventTypes.CONFIRM_WIDGET_RESET_REQUEST_HOST_MSG
  };
};
export var createSelectToNumberMessage = function createSelectToNumberMessage(toSubject) {
  return {
    type: internalEventTypes.SELECT_TO_NUMBER_HOST_MSG,
    data: {
      toSubject: toSubject
    }
  };
};
export var createSetWidgetCapabilitiesMessage = function createSetWidgetCapabilitiesMessage(capabilities) {
  return {
    type: internalEventTypes.SET_WIDGET_CAPABILITIES_HOST_MSG,
    data: {
      capabilities: capabilities
    }
  };
};
export var createUpdateReadyStateMessage = function createUpdateReadyStateMessage(_ref2) {
  var toSubject = _ref2.toSubject,
      isQueueTask = _ref2.isQueueTask;
  return {
    type: internalEventTypes.UPDATE_READY_STATE_HOST_MSG,
    data: {
      toSubject: toSubject,
      isQueueTask: isQueueTask
    }
  };
};
export var createShowSettingsStateMessage = function createShowSettingsStateMessage(_ref3) {
  var registerFromNumber = _ref3.registerFromNumber,
      learnMore = _ref3.learnMore,
      addPhoneNumber = _ref3.addPhoneNumber,
      toSubject = _ref3.toSubject;
  return {
    type: internalEventTypes.SHOW_SETTINGS_STATE_HOST_MSG,
    data: {
      registerFromNumber: registerFromNumber,
      learnMore: learnMore,
      addPhoneNumber: addPhoneNumber,
      toSubject: toSubject
    }
  };
};
export var createSetThreadIdMessage = function createSetThreadIdMessage(threadId) {
  return {
    type: internalEventTypes.SET_THREAD_ID_HOST_MSG,
    data: {
      threadId: threadId
    }
  };
};
export var createSetDefaultAssociationsForThirdParty = function createSetDefaultAssociationsForThirdParty(payload) {
  return {
    type: internalEventTypes.SET_DEFAULT_ASSOCIATIONS_THIRD_PARTY_HOST_MSG,
    data: payload
  };
};
/**
 * HOST <- IFRAME
 */

export var createCallStartedMessage = function createCallStartedMessage(payload) {
  return {
    type: internalEventTypes.CALL_STARTED_EMBED_MSG,
    data: payload
  };
};
export var createCallAnsweredMessage = function createCallAnsweredMessage() {
  return {
    type: internalEventTypes.CALL_ANSWERED_EMBED_MSG
  };
};
export var createCallEndedMessage = function createCallEndedMessage(_ref4) {
  var twilioCallStatus = _ref4.twilioCallStatus,
      twilioCallDurationMs = _ref4.twilioCallDurationMs;
  return {
    type: internalEventTypes.CALL_ENDED_EMBED_MSG,
    data: {
      twilioCallStatus: twilioCallStatus,
      twilioCallDurationMs: twilioCallDurationMs
    }
  };
};
export var createCallSavedMessage = function createCallSavedMessage(_ref5) {
  var engagementId = _ref5.engagementId,
      shouldCompleteTask = _ref5.shouldCompleteTask;
  return {
    type: internalEventTypes.CALL_SAVED_EMBED_MSG,
    data: {
      engagementId: engagementId,
      shouldCompleteTask: shouldCompleteTask
    }
  };
};
export var createNotificationMessage = function createNotificationMessage(_ref6) {
  var titleText = _ref6.titleText,
      message = _ref6.message,
      notificationType = _ref6.notificationType;
  return {
    type: internalEventTypes.NOTIFICATION_EMBED_MSG,
    data: {
      titleText: titleText,
      message: message,
      notificationType: notificationType
    }
  };
};
export var createSetOnboardingStatusMessage = function createSetOnboardingStatusMessage(onboardingStatus) {
  return {
    type: internalEventTypes.SET_ONBOARDING_STATUS_EMBED_MSG,
    data: {
      onboardingStatus: onboardingStatus
    }
  };
};
export var createSetMinimumDimensionsMessage = function createSetMinimumDimensionsMessage(minHeight) {
  return {
    type: internalEventTypes.SET_MINIMUM_DIMENSIONS_EMBED_MSG,
    data: {
      minHeight: minHeight
    }
  };
};
export var createZorseTicketMessage = function createZorseTicketMessage() {
  return {
    type: internalEventTypes.CREATE_ZORSE_TICKET_EMBED_MSG
  };
};
export var createCreatedFollowupTaskMessage = function createCreatedFollowupTaskMessage(engagementId) {
  return {
    type: internalEventTypes.CREATED_FOLLOWUP_TASK_EMBED_MSG,
    data: {
      engagementId: engagementId
    }
  };
};
export var createRenderDiscardFollowupTask = function createRenderDiscardFollowupTask() {
  return {
    type: internalEventTypes.RENDER_DISCARD_FOLLOW_UP_TASK_EMBED_MSG
  };
};
export var createSwitchToThirdPartyMessage = function createSwitchToThirdPartyMessage(dialNumberPayload) {
  return {
    type: internalEventTypes.SWITCH_TO_THIRD_PARTY_EMBED_MSG,
    data: dialNumberPayload
  };
};
export var createRefreshCalleeOmnibus = function createRefreshCalleeOmnibus(_ref7) {
  var subjectId = _ref7.subjectId,
      objectTypeId = _ref7.objectTypeId;
  return {
    type: internalEventTypes.REFRESH_CALLEE_OMNIBUS_EMBED_MSG,
    data: {
      subjectId: subjectId,
      objectTypeId: objectTypeId
    }
  };
};
export var createConfirmWidgetResetResponse = function createConfirmWidgetResetResponse(shouldConfirm) {
  return {
    type: internalEventTypes.CONFIRM_WIDGET_RESET_RESPONSE_EMBED_MSG,
    data: {
      shouldConfirm: shouldConfirm
    }
  };
};
export var createSetDefaultAssociationsForThirdPartyResponse = function createSetDefaultAssociationsForThirdPartyResponse(data) {
  return {
    type: internalEventTypes.SET_DEFAULT_ASSOCIATIONS_THIRD_PARTY_EMBED_MSG,
    data: data
  };
};
/**
 * HOST <-> IFRAME
 */

export var createUpdateCalleeMessage = function createUpdateCalleeMessage(_ref8) {
  var objectId = _ref8.objectId,
      objectTypeId = _ref8.objectTypeId,
      rawValue = _ref8.rawValue,
      property = _ref8.property;
  return {
    type: internalEventTypes.UPDATE_CALLEE_NUMBER_MSG,
    data: {
      objectId: objectId,
      objectTypeId: objectTypeId,
      rawValue: rawValue,
      property: property
    }
  };
}; // matches structure of calling-internal-common/call-provider/records/CallingProvider

export var createSelectedCallProviderMessage = function createSelectedCallProviderMessage(_ref9) {
  var appId = _ref9.appId,
      height = _ref9.height,
      isReady = _ref9.isReady,
      name = _ref9.name,
      supportsCustomObjects = _ref9.supportsCustomObjects,
      url = _ref9.url,
      width = _ref9.width;
  return {
    type: internalEventTypes.SELECTED_CALL_PROVIDER_MSG,
    data: {
      appId: appId,
      height: height,
      isReady: isReady,
      name: name,
      supportsCustomObjects: supportsCustomObjects,
      url: url,
      width: width
    }
  };
};
export var createSelectedCallProviderSettingMessage = function createSelectedCallProviderSettingMessage(_ref10) {
  var callingProvider = _ref10.callingProvider,
      fromNumber = _ref10.fromNumber;
  return {
    type: internalEventTypes.SELECTED_CALL_PROVIDER_SETTING_MSG,
    data: {
      callingProvider: callingProvider,
      fromNumber: fromNumber || null
    }
  };
};
export var createSelectedFromNumberMessage = function createSelectedFromNumberMessage(fromNumber) {
  return {
    type: internalEventTypes.SELECTED_FROM_NUMBER_MSG,
    data: {
      fromNumber: fromNumber
    }
  };
};
export var createSelectedCallMethodMessage = function createSelectedCallMethodMessage(callMethod) {
  return {
    type: internalEventTypes.SELECTED_CALL_METHOD_MSG,
    data: {
      callMethod: callMethod
    }
  };
};
export var createSetIsQueueTaskMessage = function createSetIsQueueTaskMessage(isQueueTask) {
  return {
    type: internalEventTypes.SET_IS_QUEUE_TASK_HOST_MSG,
    data: {
      isQueueTask: isQueueTask
    }
  };
};
export var createRemoveCallableAssociationMessage = function createRemoveCallableAssociationMessage(data) {
  return {
    type: internalEventTypes.REMOVE_CALLABLE_ASSOCIATION_MSG,
    data: data
  };
};
export var createAddCallableAssociationMessage = function createAddCallableAssociationMessage(data) {
  return {
    type: internalEventTypes.ADD_CALLABLE_ASSOCIATION_MSG,
    data: data
  };
};