import ApiItemTypeEnum from './ApiItemTypeEnum';
import type { AppointmentReadAdapter } from 'owa-addins-adapters';
import type CalendarItem from 'owa-service/lib/contract/CalendarItem';
import getInitialContextualData from './getInitialContextualData';
import type InitialAppointmentReadData from './InitialAppointmentReadData';
import { convertRecurrenceToAddinFormat } from 'owa-addins-recurrence';
import { createAttachmentDetails } from 'owa-addins-apis-types';
import type { IAddinCommand } from 'owa-addins-store';
import {
    createEmailAddressDetailsFromAttendeeType,
    convertAttendeeTypeArrayToEmailAddressDetailsArray,
    EmailAddressDetails,
} from './EmailAddressDetails';

export default async function getInitialAppointmentReadData(
    adapter: AppointmentReadAdapter,
    addInCommand: IAddinCommand,
    hostItemIndex: string,
    data: InitialAppointmentReadData
): Promise<InitialAppointmentReadData> {
    data.itemType = ApiItemTypeEnum.Appointment;
    const calendarItem = (await adapter.getItem()) as CalendarItem;
    data.id = calendarItem.ItemId.Id;
    data.end = calendarItem.End;
    data.start = calendarItem.Start;
    data.location = calendarItem.Location ? calendarItem.Location.DisplayName : '';
    data.dateTimeCreated = calendarItem.DateTimeCreated
        ? new Date(calendarItem.DateTimeCreated)
        : null;
    data.dateTimeModified = calendarItem.LastModifiedTime
        ? new Date(calendarItem.LastModifiedTime)
        : null;
    data.itemClass = calendarItem.ItemClass;
    data.subject = calendarItem.Subject;
    data.normalizedSubject = calendarItem.Subject;
    data.organizer = createEmailAddressDetailsFromAttendeeType(calendarItem.Organizer);
    const requiredAttendees = convertAttendeeTypeArrayToEmailAddressDetailsArray(
        calendarItem.RequiredAttendees
    );
    data.to = addOrganizerToRequiredAttendees(requiredAttendees, data.organizer);
    data.cc = convertAttendeeTypeArrayToEmailAddressDetailsArray(calendarItem.OptionalAttendees);
    data.attachments = calendarItem.Attachments
        ? createAttachmentDetails(calendarItem.Attachments)
        : [];
    const recurrenceType = await adapter.getRecurrence();
    data.recurrence = convertRecurrenceToAddinFormat({
        recurrenceType,
        timeZone: calendarItem.StartTimeZoneId,
        startTime: new Date(calendarItem.Start),
        endTime: new Date(calendarItem.End),
    });
    data.resources = convertAttendeeTypeArrayToEmailAddressDetailsArray(calendarItem.Resources);
    data.seriesId = await adapter.getSeriesId();
    data = await getInitialContextualData(hostItemIndex, calendarItem, addInCommand, data);

    return data;
}

function addOrganizerToRequiredAttendees(
    requiredAttendees: EmailAddressDetails[],
    organizer: EmailAddressDetails
) {
    if (organizer) {
        const hasOrganizer = requiredAttendees.some(
            attendee => attendee.address.toLowerCase() === organizer.address.toLowerCase()
        );
        if (!hasOrganizer) {
            return requiredAttendees.concat(organizer);
        }
    }

    return requiredAttendees;
}
