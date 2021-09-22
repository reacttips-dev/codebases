import type ApiEventRegisterArgs from './schema/ApiEventRegisterArgs';
import invokeCallback from './utils/invokeCallback';
import selectEventByDispId from './utils/selectEventByDispId';
import type { ApiEventCallback } from './schema/ApiEventCallback';
import { deleteApiEventHandler, isControlRegistered } from './storage/ActiveApiEvents';
import type { OutlookEventDispId } from './schema/OutlookEventDispId';
import {
    getControlNotRegisteredResult,
    getSuccessResult,
    ApiEventResult,
    isSuccess,
} from './schema/ApiEventResult';

export default function unregisterApiEvent(
    args: ApiEventRegisterArgs,
    callback?: ApiEventCallback
) {
    const apiEvent = selectEventByDispId(args.eventDispId);
    let result = apiEvent.unregister(args.controlId);
    if (isSuccess(result)) {
        result = deleteHandler(args.controlId, args.eventDispId);
    }
    invokeCallback(callback, result);
}

function deleteHandler(controlId: string, eventDispId: OutlookEventDispId): ApiEventResult {
    if (!isControlRegistered(controlId, eventDispId)) {
        return getControlNotRegisteredResult();
    }

    deleteApiEventHandler(controlId, eventDispId);
    return getSuccessResult();
}
