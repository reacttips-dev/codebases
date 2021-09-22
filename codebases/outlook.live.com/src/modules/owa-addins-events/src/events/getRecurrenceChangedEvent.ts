import type { ApiEvent } from '../schema/ApiEvent';
import {
    defaultEventRegistrationHandler,
    defaultEventUnregistrationHandler,
    defaultEventOnTriggerHandler,
} from './defaultEventHandlers';

export default function getRecurrenceChangedEvent(): ApiEvent {
    return {
        register: defaultEventRegistrationHandler,
        unregister: defaultEventUnregistrationHandler,
        onTrigger: defaultEventOnTriggerHandler,
        formatArgsForHandler,
    };
}

function formatArgsForHandler(args: any): any {
    const contents = {
        recurrence: JSON.stringify(args.recurrence),
    };
    return [JSON.stringify(contents)];
}
