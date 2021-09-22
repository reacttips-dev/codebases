import { CalendarEndpointType } from '../store/schema/CalendarEndpointType';
import { assertNever } from 'owa-assert';
import { getUserMailboxInfo } from 'owa-client-ids';

export function getAccountIdentifier(
    calendarEndpointType: CalendarEndpointType,
    userId?: string
): string {
    switch (calendarEndpointType) {
        case CalendarEndpointType.Outlook:
        case CalendarEndpointType.OutlookGroup:
            // Outlook calendars or group calendars can be loaded for primary and connected accounts. The userId (a smtp address) + the account type
            // are used to uniquely identify each account.
            const id = userId || getUserMailboxInfo().userIdentity;
            return id + calendarEndpointType.toString();
        case CalendarEndpointType.TeamsCalendars:
            // For now, we have only implemented the loading of teams/channels calendars for the primary account, so the provider type can be used as the unique
            // account identifier
            return calendarEndpointType.toString();
        default:
            return assertNever(calendarEndpointType);
    }
}
