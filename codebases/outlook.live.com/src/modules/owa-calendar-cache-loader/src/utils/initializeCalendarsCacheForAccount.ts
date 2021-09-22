import { CalendarEndpointType } from '../store/schema/CalendarEndpointType';
import { assertNever } from 'owa-assert';
import { initializeOutlookAccountCalendarsInCache } from 'owa-calendarsapi-outlook';
import { initializeGroupCalendars } from 'owa-calendarsapi-outlook-groups';
import { lazyInitializeSelectedTeamsCalendars } from 'owa-calendarsapi-teams-calendars';
import { isFeatureEnabled } from 'owa-feature-flags';

export async function initializeCalendarsCacheForAccount(
    calendarEndpointType: CalendarEndpointType,
    userId: string
): Promise<void> {
    switch (calendarEndpointType) {
        case CalendarEndpointType.Outlook:
            await initializeOutlookAccountCalendarsInCache(userId);
            break;
        case CalendarEndpointType.OutlookGroup:
            await initializeGroupCalendars(userId);
            break;
        case CalendarEndpointType.TeamsCalendars:
            if (isFeatureEnabled('cal-showAddTeamsCalendars')) {
                await lazyInitializeSelectedTeamsCalendars.importAndExecute();
            }
            break;
        default:
            assertNever(calendarEndpointType);
    }
}
