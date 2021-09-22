import { action } from 'satcheljs';
import type { ClientItemId } from 'owa-client-ids';
import type { EventsCacheLockId } from 'owa-calendar-events-loader';

export const updateUpNextEvent = action(
    'updateUpNextEvent',
    (id: ClientItemId | null, eventsCacheLockId: EventsCacheLockId) => ({
        id,
        eventsCacheLockId,
    })
);
