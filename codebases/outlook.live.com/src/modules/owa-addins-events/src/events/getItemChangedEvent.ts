import triggerApiEvent from '../triggerApiEvent';
import type { ApiEvent } from '../schema/ApiEvent';
import { ApiEventResult, getSuccessResult } from '../schema/ApiEventResult';
import { isControlRegistered } from '../storage/ActiveApiEvents';
import { logUsage } from 'owa-analytics';
import { OutlookEventDispId } from '../schema/OutlookEventDispId';
import {
    defaultFormatArgsForHandler,
    defaultEventRegistrationHandler,
    defaultEventUnregistrationHandler,
} from './defaultEventHandlers';

let didPreviousOnTriggerFail: boolean = false;
let failedOnTriggerArgs: { controlId: string; args: any } = null;

export interface ItemChangedApiEvent extends ApiEvent {
    invokeHandlerIfPreviousOnTriggerFailed(controlId: string);
}

export default function getItemChangedEvent(): ItemChangedApiEvent {
    return {
        register: defaultEventRegistrationHandler,
        unregister: defaultEventUnregistrationHandler,
        onTrigger,
        formatArgsForHandler: defaultFormatArgsForHandler,
        invokeHandlerIfPreviousOnTriggerFailed,
    };
}

function onTrigger(args: any, controlId: string): ApiEventResult {
    storeArgsForNonExistentHandler(args, controlId);

    return getSuccessResult();
}

function invokeHandlerIfPreviousOnTriggerFailed(controlId: string): void {
    if (didPreviousOnTriggerFail && failedOnTriggerArgs.controlId === controlId) {
        triggerApiEvent(
            OutlookEventDispId.ITEM_CHANGED_EVENT_DISPID,
            controlId,
            failedOnTriggerArgs.args
        );
    }
    didPreviousOnTriggerFail = false;
    failedOnTriggerArgs = null;
}

function storeArgsForNonExistentHandler(args: any, controlId: string): void {
    if (!isControlRegistered(controlId, OutlookEventDispId.ITEM_CHANGED_EVENT_DISPID)) {
        didPreviousOnTriggerFail = true;
        failedOnTriggerArgs = { controlId, args };
        logUsage('ExtTriggerUnregisteredItemChangedEvent');
    }
}
