import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import calendarItem from 'owa-service/lib/factory/calendarItem';
import type DeleteItemField from 'owa-service/lib/contract/DeleteItemField';
import deleteItemField from 'owa-service/lib/factory/deleteItemField';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import type ExtendedPropertyUri from 'owa-service/lib/contract/ExtendedPropertyUri';
import extendedPropertyType from 'owa-service/lib/factory/extendedPropertyType';
import type ExtendedPropertyType from 'owa-service/lib/contract/ExtendedPropertyType';
import type SetItemField from 'owa-service/lib/contract/SetItemField';
import setItemField from 'owa-service/lib/factory/setItemField';
import type EndDateRecurrence from 'owa-service/lib/contract/EndDateRecurrence';
import type RecurrenceType from 'owa-service/lib/contract/RecurrenceType';
import message from 'owa-service/lib/factory/message';
import { getEwsRequestString, owaDate, OwaDate, getDateString } from 'owa-datetime';
import { toJS } from 'mobx';

/**
 * How to map each CalendarEvent property to a SetItemField or DeleteItemField.
 * fieldUri defaults to propertyName.
 * We're assuming propertyName doubles as 'keyof CalendarItem'.
 * If this becomes not true, we can add another property to this to map.
 */
interface PropertyDefinition {
    fieldUri?: string;
    getEwsValue?: (this: void, value: any, timeZoneId: string) => any;
    useDeleteItemField?: boolean;
    extendedPropertyUri?: ExtendedPropertyUri;
}

/**
 * Map CalendarEvent properties to a PropertyDefinition.
 * Properties not in this map are considered not supported.
 */
const propertyMap: Partial<Record<keyof CalendarEvent, PropertyDefinition>> = {
    Start: { getEwsValue: getEwsDate },
    End: { getEwsValue: getEwsDate },
    Subject: {},
    Body: {},
    IsAllDayEvent: {},
    IsRoomRequested: {},
    IsDraft: {},
    Locations: {},
    Recurrence: { getEwsValue: getRecurrence, useDeleteItemField: true },
    FreeBusyType: { fieldUri: 'LegacyFreeBusyStatus' },
    ReminderMinutesBeforeStart: {},
    ReminderIsSet: {},
    CharmId: { fieldUri: 'Charm', useDeleteItemField: true },
    Sensitivity: {},
    Categories: { fieldUri: 'Categories' },
    IsResponseRequested: { fieldUri: 'CalendarIsResponseRequested' },
    DoNotForwardMeeting: {},
    RequiredAttendees: {},
    IsOnlineMeeting: {},
    OnlineMeetingProvider: {},
    OptionalAttendees: {},
    InboxReminders: { getEwsValue: nullifyIfEmpty, useDeleteItemField: true },
    Resources: {},
    StartTimeZoneId: {},
    EndTimeZoneId: {},
    InReplyTo: {},
    HideAttendees: {},
    SkypeTeamsProperties: {},
    DocLinks: {},
    CollabSpace: {
        extendedPropertyUri: {
            DistinguishedPropertySetId: 'PublicStrings',
            PropertyName: 'MeetingAgenda',
            PropertyType: 'String',
        },
    },
};

/**
 * Takes the key/value of the property to be updated and returns a SetItemField.
 * This needs to handle all properties of CalendarEvent.
 * TODO: At present this handles updates for a few properties, need to implement the updates as we need them in the UI
 * @param propertyName name of the property to be updated in the calendar item object
 * @param value Value of the property to be updated
 * @param timeZoneId The time zone that will be sent in the request header. Dates should be relative to this time zone.
 */
export default function getUpdateForProperty(
    propertyName: keyof CalendarEvent,
    value: any,
    timeZoneId: string
): SetItemField | DeleteItemField | null {
    const mapping = propertyMap[propertyName];

    if (mapping) {
        if (mapping.extendedPropertyUri) {
            const extendedProperty: ExtendedPropertyType = {
                ExtendedFieldURI: mapping.extendedPropertyUri,
                Value: value,
            };
            // TODO: Use the existing method packages\mail\packages\mail\data\owa-mail-store\lib\services\utils\createSetItemExtendedPropertyField.ts
            // after it has been moved to a common place so both mail and calendar can use these utils.
            // VSO Item to track this: https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/92591
            return setItemField({
                Path: extendedPropertyUri(extendedProperty.ExtendedFieldURI),
                Item: message({ ExtendedProperty: [extendedPropertyType(extendedProperty)] }),
            });
        } else {
            const { fieldUri = propertyName as string, getEwsValue, useDeleteItemField } = mapping;
            const path = propertyUri({ FieldURI: fieldUri });
            const ewsValue = getEwsValue ? getEwsValue(value, timeZoneId) : value;
            if (!useDeleteItemField || ewsValue) {
                return setItemField({
                    Path: path,
                    Item: calendarItem({
                        [propertyName]: ewsValue,
                    }),
                });
            } else {
                return deleteItemField({
                    Path: path,
                });
            }
        }
    }

    return null;
}

function getEwsDate(date: OwaDate, timeZoneId: string) {
    return date ? getEwsRequestString(owaDate(timeZoneId, date)) : null;
}

function nullifyIfEmpty(arr: any[]) {
    return !arr || arr.length === 0 ? null : arr;
}

function getRecurrence(recurrence: RecurrenceType, timeZoneId: string) {
    const value = toJS(recurrence);
    if (value) {
        const recurrenceRange = value.RecurrenceRange as EndDateRecurrence;
        const { StartDate, EndDate } = recurrenceRange;
        if (StartDate) {
            recurrenceRange.StartDate = getDateString(owaDate(timeZoneId, StartDate));
        }
        if (EndDate) {
            recurrenceRange.EndDate = getDateString(owaDate(timeZoneId, EndDate));
        }
    }
    return value;
}
