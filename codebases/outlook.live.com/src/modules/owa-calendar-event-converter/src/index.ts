import getDisplayPreviewText from './getDisplayPreviewText';
import { getUserMailboxInfo, MailboxInfo } from 'owa-client-ids';
import { cleanTimeZoneId } from 'owa-datetime-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getConfig } from 'owa-service/lib/config';
import type BusyType from 'owa-service/lib/contract/BusyType';
import type CalendarItem from 'owa-service/lib/contract/CalendarItem';
import type CalendarItemExperienceType from 'owa-service/lib/contract/CalendarItemExperienceType';
import type ResponseTypeType from 'owa-service/lib/contract/ResponseTypeType';
import {
    getDisplayDateFromEwsDate,
    getEwsRequestString,
    parse,
    addHours,
    isWithinRange,
    utcDate,
    differenceInMinutes,
    addMinutes,
} from 'owa-datetime';
import CalendarEvent, {
    createEmptyCalendarEvent,
} from 'owa-calendar-types/lib/types/CalendarEvent';
import type { AppendOnSend } from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';
import { IsAppendOnSendExtendedProperty } from 'owa-calendar-types/lib/types/IsAppendOnSendExtendedProperty';
import extendedPropertyType from 'owa-service/lib/factory/extendedPropertyType';
import { IsBookedFreeBlocksExtendedProperty } from 'owa-calendar-types/lib/types/IsBookedFreeBlocksExtendedProperty';
import { CollabSpaceExtendedProperty } from 'owa-calendar-types/lib/types/CollabSpaceExtendedProperty';
import { TravelTimeEventsLinkedExtendedProperty } from 'owa-calendar-types/lib/types/TravelTimeEventsLinkedExtendedProperty';
import { FlexEventsMetadataExtendedProperty } from 'owa-calendar-types/lib/types/FlexEventsMetadataExtendedProperty';

export { default as getDisplayPreviewText } from './getDisplayPreviewText';
export { calendarEventFromBirthdayEvent } from './utils/calendarEventFromBirthdayEvent';
import { convertAutoRoomBookingStatusToOws } from 'convert-calendar-item';

// TODO VSO 113957: Replace CalendarEvent client type with GraphQL CalendarEvent type
// Remove this code once we are consuming  GraphQL CalendarEvent

// Create empty instance of CalendarEvent so that mobX doesn't freak out
const emptyCalendarEvent = createEmptyCalendarEvent();

// Hack for Brasilia DST issue until server gets proper fix.
// See https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/63446
// These dates are coming from the time zone blob indicated on this bug.
// You can find them by creating an event that repeats every day at midnight (in Brasilia TZ)
// then replace the time zone blob with the one in the bug and check the dates where it gets
// incorrectly shifted. That being said, blobs from previous years might indicate different
// dates, in case the country changed the rules, so right now, this is a best guess.
// Being a quick-and-dirty hack, this is likely going to break for some unexpected case
// and the assumption is that eventually the server code will be fixed and will send the right data.
const hackDates = [
    [utcDate('2019-11-03T00:00:00.000-03:00'), utcDate('2020-02-15T23:59:59.999-03:00')],
    [utcDate('2020-11-08T00:00:00.000-03:00'), utcDate('2021-02-20T23:59:59.999-03:00')],
    [utcDate('2021-11-07T00:00:00.000-03:00'), utcDate('2022-02-20T23:59:59.999-03:00')],
];

/**
 * Converts a CalendarItem instance to CalendarEvent. This function will be used mostly from service
 * functions to convert the returned CalendarItem service objects to CalendarEvent instances for
 * consumption by the application.
 * @param calendarItem The calendar item (service object) to convert
 * @param mailboxInfo The mailbox info for the calendar event
 * @returns The converted CalendarEvent object
 */
//
export function calendarEvent(calendarItem: CalendarItem, mailboxInfo: MailboxInfo): CalendarEvent {
    // If no mailboxInfo is provided then get the user mailbox info
    mailboxInfo = mailboxInfo || getUserMailboxInfo();

    // Additional (Extended) Properties
    let appendOnSend: AppendOnSend[] = [];
    let isBookedFreeBlocks: boolean = false;
    let collabSpace: string = null;
    let travelTimeLinked: boolean = false;
    let flexEventsMetadata: string = null;

    if (calendarItem?.ExtendedProperty) {
        let matchingProperty = calendarItem.ExtendedProperty.filter(
            item =>
                item.ExtendedFieldURI?.PropertyName === IsAppendOnSendExtendedProperty.PropertyName
        )[0];
        if (matchingProperty?.Value) {
            try {
                appendOnSend = JSON.parse(matchingProperty.Value);
            } catch {
                appendOnSend = [];
            }
        }

        if (
            calendarItem.ExtendedProperty.some(
                item =>
                    item.ExtendedFieldURI?.PropertyName ===
                        IsBookedFreeBlocksExtendedProperty.PropertyName && !!item.Value
            )
        ) {
            isBookedFreeBlocks = true;
        }

        matchingProperty = calendarItem.ExtendedProperty.filter(
            item => item.ExtendedFieldURI?.PropertyName === CollabSpaceExtendedProperty.PropertyName
        )[0];
        if (matchingProperty?.Value) {
            collabSpace = matchingProperty.Value;
        }

        matchingProperty = calendarItem.ExtendedProperty.filter(
            item =>
                item.ExtendedFieldURI?.PropertyName ===
                FlexEventsMetadataExtendedProperty.PropertyName
        )[0];
        if (matchingProperty?.Value) {
            flexEventsMetadata = matchingProperty.Value;
        }

        matchingProperty = calendarItem.ExtendedProperty.filter(
            item =>
                item.ExtendedFieldURI?.PropertyName ===
                TravelTimeEventsLinkedExtendedProperty.PropertyName
        )[0];
        if (matchingProperty?.Value) {
            travelTimeLinked = matchingProperty.Value.toLowerCase() === 'true';
        }
    }

    // Copy then overwrite with proper conversions
    const ev = {
        ...emptyCalendarEvent,
        ...calendarItem,
        ...{
            ItemId: calendarItem.ItemId
                ? { ...calendarItem.ItemId, mailboxInfo: mailboxInfo }
                : calendarItem.ItemId,
            ParentFolderId: calendarItem.ParentFolderId
                ? { ...calendarItem.ParentFolderId, mailboxInfo: mailboxInfo }
                : calendarItem.ParentFolderId,
            Start: parseCalendarItemDate(calendarItem.Start),
            End: parseCalendarItemDate(calendarItem.End),
            StartTimeZoneId: cleanTimeZoneId(calendarItem.StartTimeZoneId),
            EndTimeZoneId: cleanTimeZoneId(calendarItem.EndTimeZoneId),
            LastModifiedTime: parseCalendarItemDate(calendarItem.LastModifiedTime),
            FreeBusyType: calendarItem.FreeBusyType as BusyType,
            ResponseType: calendarItem.ResponseType as ResponseTypeType,
            AppointmentReplyTime: parseCalendarItemDate(calendarItem.AppointmentReplyTime),
            ExperienceType: calendarItem.ExperienceType
                ? calendarItem.ExperienceType
                : ('Unspecified' as CalendarItemExperienceType),
            SeriesMasterItemId: calendarItem.SeriesMasterItemId
                ? { ...calendarItem.SeriesMasterItemId, mailboxInfo: mailboxInfo }
                : null,

            // https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/43633
            // Treat any "private" group calendar events as if it was a normal event.
            // The only drawback I see with this is that IF one creates such a "private" event, say,
            // using Desktop Outlook, then it will show the lock icon and we won't. I don't think this
            // is a big deal, but if we decide that it is, then we will need to modify any other code that
            // depends on this property, beginning with owa-calendar-event-capabilities canEdit/canModify.
            Sensitivity:
                mailboxInfo.type == 'GroupMailbox' && calendarItem.Sensitivity == 'Private'
                    ? 'Normal'
                    : calendarItem.Sensitivity,

            Preview: getDisplayPreviewText(calendarItem.Preview),

            // Additional (Extended) Properties
            AppendOnSend: appendOnSend,
            IsBookedFreeBlocks: isBookedFreeBlocks,
            CollabSpace: collabSpace,
            TravelTimeEventsLinked: travelTimeLinked,
            FlexEventsMetadata: flexEventsMetadata,
        },
    } as CalendarEvent;

    // Hack for Brasilia DST issue until server gets proper fix.
    // See https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/63446
    // Be aware this is a quick-and-dirty workaround to show specific events in the correct place
    // in the calendar surface, so there's a real chance it will bite us back somewhere else.
    // Note the assumptions we're making, to limit the number of events we're going to change.
    // In particular, I'm assuming the EndTimeZoneId instead of asking for PidLidTimeZoneDescription
    // as mentioned in the bug with the idea that most people don't mix start/end time zones.
    if (
        !calendarItem.IsAllDayEvent &&
        calendarItem.SeriesId &&
        calendarItem.CalendarItemType == 'Occurrence' &&
        calendarItem.StartTimeZoneId == 'tzone://Microsoft/Custom' &&
        calendarItem.EndTimeZoneId == 'E. South America Standard Time' &&
        !isFeatureEnabled('cal-killSwitch-63446') &&
        ev.Start &&
        ev.End
    ) {
        if (hackDates.some(([hackStart, hackEnd]) => isWithinRange(ev.Start, hackStart, hackEnd))) {
            const duration = differenceInMinutes(ev.End, ev.Start);
            ev.Start = addHours(ev.Start, 1);
            ev.End = addMinutes(ev.Start, duration);
            ev.StartTimeZoneId = ev.EndTimeZoneId;
            ev['__BrazilHack__'] = 1;
        }
    }

    return ev;
}

export function parseCalendarItemDate(date?: string) {
    // All production calls to calendarEvent() are done in response to
    // an EWS call or notification, which returns data in the user's time zone.
    // We can parse making this assumption, to handle dates outside the known DST
    // ranges without losing the offset returned by the server.
    if (date) {
        if (isFeatureEnabled('cal-assumeTzOffsetFromCalendarItem')) {
            const assumeDatesAreInThisTz = getConfig().timezone;
            const assumeOffsetFromStringIsCorrect = !!assumeDatesAreInThisTz;
            return parse(assumeDatesAreInThisTz, date, assumeOffsetFromStringIsCorrect);
        }
        return getDisplayDateFromEwsDate(date);
    }
    return undefined;
}

/**
 * Converts a CalendarEvent instance to CalendarItem. This function for the most part will be called
 * only within functions that deal directly with making service requests. Other code should only use
 * CalendarEvent instances.
 * @param calendarEvent The CalendarEvent object
 * @returns The converted CalendarItem instance
 */
export function toCalendarItem(calendarEvent: CalendarEvent): CalendarItem {
    // Additional (Extended) Properties
    const extendedProperties = [];
    if (calendarEvent.AppendOnSend && calendarEvent.AppendOnSend.length > 0) {
        extendedProperties.push(
            extendedPropertyType({
                ExtendedFieldURI: IsAppendOnSendExtendedProperty,
                Value: JSON.stringify(calendarEvent.AppendOnSend),
            })
        );
    }
    if (calendarEvent.FlexEventsMetadata) {
        extendedProperties.push(
            extendedPropertyType({
                ExtendedFieldURI: FlexEventsMetadataExtendedProperty,
                Value: calendarEvent.FlexEventsMetadata,
            })
        );
    }
    if (calendarEvent.IsBookedFreeBlocks) {
        extendedProperties.push(
            extendedPropertyType({
                ExtendedFieldURI: IsBookedFreeBlocksExtendedProperty,
                Value: calendarEvent.IsBookedFreeBlocks.toString(), // need to coerce boolean to string to satisfy server requirements
            })
        );
    }
    if (calendarEvent.CollabSpace) {
        extendedProperties.push(
            extendedPropertyType({
                ExtendedFieldURI: CollabSpaceExtendedProperty,
                Value: calendarEvent.CollabSpace,
            })
        );
    }
    if (calendarEvent.TravelTimeEventsLinked) {
        extendedProperties.push(
            extendedPropertyType({
                ExtendedFieldURI: TravelTimeEventsLinkedExtendedProperty,
                Value: calendarEvent.TravelTimeEventsLinked.toString(), // need to coerce boolean to string to satisfy server requirements
            })
        );
    }
    return {
        __type: 'CalendarItem:#Exchange',
        ...calendarEvent,
        Start: calendarEvent.Start && getEwsRequestString(calendarEvent.Start),
        End: calendarEvent.End && getEwsRequestString(calendarEvent.End),
        LastModifiedTime:
            calendarEvent.LastModifiedTime && getEwsRequestString(calendarEvent.LastModifiedTime),
        AppointmentReplyTime:
            calendarEvent.AppointmentReplyTime &&
            getEwsRequestString(calendarEvent.AppointmentReplyTime),
        FreeBusyType: calendarEvent.FreeBusyType as string,
        CharmId: calendarEvent.CharmId,
        IsDraft: calendarEvent.IsDraft,
        IsRoomRequested: calendarEvent.IsRoomRequested,
        SkypeTeamsProperties:
            calendarEvent.SkypeTeamsProperties &&
            JSON.stringify(calendarEvent.SkypeTeamsProperties),
        ExtendedProperty: extendedProperties,
        AutoRoomBookingStatus:
            calendarEvent.AutoRoomBookingStatus &&
            convertAutoRoomBookingStatusToOws(calendarEvent.AutoRoomBookingStatus),
    } as CalendarItem;
}
