import { action } from 'satcheljs';
import type { ClientItemId } from 'owa-client-ids';
import type { EventsCacheLockId } from 'owa-calendar-events-loader';

export const cancelRefreshUpNextPoll = action(
    'cancelRefreshUpNextPoll',
    (eventsCacheLockId: EventsCacheLockId) => ({
        eventsCacheLockId,
    })
);

export const onUpNextEventUpdated = action(
    'onUpNextEventUpdated',
    (
        id: ClientItemId | null,
        parentFolderId: ClientItemId,
        eventsCacheLockId: EventsCacheLockId
    ) => ({
        id,
        parentFolderId,
        eventsCacheLockId,
    })
);

export const initializeUpNextEventLoader = action(
    'initializeUpNextEventLoader',
    (calendarIds: string[], eventsCacheLockId: EventsCacheLockId) => ({
        calendarIds,
        eventsCacheLockId,
    })
);

export { updateCalendarIds as updateUpNextCalendarIds } from 'owa-calendar-events-loader';
