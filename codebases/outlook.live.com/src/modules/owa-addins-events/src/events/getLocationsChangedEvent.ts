import type { ApiEvent } from '../schema/ApiEvent';
import {
    defaultEventOnTriggerHandler,
    defaultEventRegistrationHandler,
    defaultEventUnregistrationHandler,
} from './defaultEventHandlers';

export default function getLocationsChangedEvent(): ApiEvent {
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
