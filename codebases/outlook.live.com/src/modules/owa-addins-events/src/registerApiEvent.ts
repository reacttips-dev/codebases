import type ApiEventHandler from './schema/ApiEventHandler';
import type ApiEventRegisterArgs from './schema/ApiEventRegisterArgs';
import invokeCallback from './utils/invokeCallback';
import invokePostCallbackRegisterLogic from './utils/invokePostCallbackRegisterLogic';
import selectEventByDispId from './utils/selectEventByDispId';
import type { ApiEventCallback } from './schema/ApiEventCallback';
import { setApiEventHandler } from './storage/ActiveApiEvents';
import { isUilessAddinRunning } from 'owa-addins-store';
import { OutlookEventDispId } from './schema/OutlookEventDispId';
import {
    getApiCallNotSupportedByExtPointErrorResult,
    getSuccessResult,
    ApiEventResult,
    isSuccess,
} from './schema/ApiEventResult';
import { isFeatureEnabled } from 'owa-feature-flags';
import isAutorunAndApiEventBlacklisted from './utils/isAutorunAndApiEventBlacklisted';
import { logUsage } from 'owa-analytics';

export default function registerApiEvent(
    eventHandler: ApiEventHandler,
    args: ApiEventRegisterArgs,
    callback?: ApiEventCallback
) {
    const isApiEventBlacklisted = isAutorunAndApiEventBlacklisted(args.controlId, args.eventDispId);
    if (isFeatureEnabled('addin-autoRun') && isApiEventBlacklisted) {
        logUsage('ExtRegisterApiEventNotSupportedInAutorun', [args.eventDispId]);
        invokeCallback(callback, getApiCallNotSupportedByExtPointErrorResult());
        return;
    }

    if (isUilessAddinRunning(args.controlId) && isEventIgnoredInUILess(args.eventDispId)) {
        invokeCallback(callback, getSuccessResult());
        return;
    }
    const formattedArgs = formatArgs(args);
    const apiEvent = selectEventByDispId(args.eventDispId);
    let result = apiEvent.register(args.controlId, formattedArgs);
    if (isSuccess(result)) {
        result = saveEventHandler(args.controlId, args.eventDispId, eventHandler);
    }

    invokeCallback(callback, result);
    invokePostCallbackRegisterLogic(apiEvent, args.controlId);
}

function isEventIgnoredInUILess(dispId: OutlookEventDispId): boolean {
    switch (dispId) {
        case OutlookEventDispId.DIALOG_NOTIFICATION_SHOWN_IN_ADDIN_DISPID:
        case OutlookEventDispId.DISPLAY_DIALOG_DISPID:
        case OutlookEventDispId.DIALOG_PARENT_MESSAGE_RECEIVED:
            return false;
        case OutlookEventDispId.APPOINTMENT_TIME_CHANGED_EVENT_DISPID:
        case OutlookEventDispId.ITEM_CHANGED_EVENT_DISPID:
        case OutlookEventDispId.RECIPIENTS_CHANGED_EVENT_DISPID:
        case OutlookEventDispId.RECURRENCE_CHANGED_EVENT:
        case OutlookEventDispId.LOCATIONS_CHANGED_EVENT:
        case OutlookEventDispId.ATTACHMENTS_CHANGED_EVENT_DISPID:
            return true;
    }
}

function formatArgs(args: ApiEventRegisterArgs): any {
    return args.targetId ? JSON.parse(args.targetId) : null;
}

function saveEventHandler(
    controlId: string,
    eventDispId: OutlookEventDispId,
    eventHandler: ApiEventHandler
): ApiEventResult {
    setApiEventHandler(controlId, eventDispId, eventHandler);
    return getSuccessResult();
}
