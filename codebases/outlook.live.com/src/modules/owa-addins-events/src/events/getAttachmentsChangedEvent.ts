import type { ApiEvent } from '../schema/ApiEvent';
import {
    defaultEventRegistrationHandler,
    defaultEventUnregistrationHandler,
    defaultEventOnTriggerHandler,
} from './defaultEventHandlers';

export default function getAttachmentsChangedEvent(): ApiEvent {
    return {
        register: defaultEventRegistrationHandler,
        unregister: defaultEventUnregistrationHandler,
        onTrigger: defaultEventOnTriggerHandler,
        formatArgsForHandler,
    };
}

function formatArgsForHandler(args: any): any {
    return [JSON.stringify(args)];
}
