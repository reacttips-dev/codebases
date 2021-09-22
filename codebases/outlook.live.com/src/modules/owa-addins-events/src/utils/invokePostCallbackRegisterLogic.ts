import type { ApiEvent } from '../schema/ApiEvent';
import type { ItemChangedApiEvent } from '../events/getItemChangedEvent';

export default function invokePostCallbackRegisterLogic(
    apiEvent: ApiEvent,
    controlId: string
): void {
    // If someday many multiple ApiEvents follow this pattern, it may make sense to generalize the function and add it to ApiEvent interface
    // for all ApiEvents to implement. For now there is only one ApiEvent doing this so it will be kept as is.
    if (isItemChangedEvent(apiEvent)) {
        (<ItemChangedApiEvent>apiEvent).invokeHandlerIfPreviousOnTriggerFailed(controlId);
    }
}

function isItemChangedEvent(apiEvent: ApiEvent): apiEvent is ItemChangedApiEvent {
    return (<ItemChangedApiEvent>apiEvent).invokeHandlerIfPreviousOnTriggerFailed !== undefined;
}
