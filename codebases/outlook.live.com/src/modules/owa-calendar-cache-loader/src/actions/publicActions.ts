import { action } from 'satcheljs';
import type { CalendarEndpointType } from '../store/schema/CalendarEndpointType';
import { OwaConnectedAccountInitSource } from 'owa-account-store-init';

export const calendarCacheInitializedForAccount = action(
    'calendarCacheInitializedForAccount',
    (
        calendarEndpointType: CalendarEndpointType,
        userId: string,
        source: OwaConnectedAccountInitSource | undefined
    ) => ({
        calendarEndpointType,
        userId,
        source,
    })
);
