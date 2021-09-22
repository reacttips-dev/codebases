import { ApiEventCallback, createApiEventCallbackArgs } from '../schema/ApiEventCallback';
import type { ApiEventResult } from '../schema/ApiEventResult';

export default function invokeCallback(
    callback: ApiEventCallback,
    eventResult: ApiEventResult
): void {
    if (callback) {
        const callbackArgs = createApiEventCallbackArgs(eventResult.EventResponseCode);
        callback(callbackArgs);
    }
}
