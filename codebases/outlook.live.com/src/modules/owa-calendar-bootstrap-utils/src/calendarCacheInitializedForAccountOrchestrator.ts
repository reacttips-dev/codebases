import { calendarCacheInitializedForAccount } from 'owa-calendar-cache-loader';
import { orchestrator } from 'satcheljs';
import { getSelectedCalendarsForUser } from 'owa-calendar-module-selected-calendars-user-config';
import { getUserMailboxInfo } from 'owa-client-ids';
import { calendarFolderIdNeedsUpdate, calendarIsInCache } from 'owa-calendar-cache';
import { getAndUpdateActualFolderId } from 'owa-calendarsapi-outlook';

orchestrator(calendarCacheInitializedForAccount, async actionMessage => {
    // This orchestrator is registered in the deeplink case/ non-calendar module calendars case
    // getAndUpdateActualFolderId is called in the regular calendar boot in selectCalendar.ts.
    // At some point we want to merge these two flows and have a single call to getAndUpdateActualFolderId
    // in both scenarios (deeplink boot and calendar boot). WI: 55812
    const { userId } = actionMessage;

    // Replace with correct calendar id for LinkedCalendarEntries
    const selectedCalendars = getSelectedCalendarsForUser(
        userId ? userId : getUserMailboxInfo().userIdentity
    );

    await Promise.all(
        selectedCalendars
            .filter(
                calendar => calendarIsInCache(calendar) && calendarFolderIdNeedsUpdate(calendar)
            )
            .map(getAndUpdateActualFolderId)
    );
});
