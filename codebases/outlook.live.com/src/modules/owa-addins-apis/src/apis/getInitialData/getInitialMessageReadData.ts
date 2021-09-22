import ApiItemTypeEnum from './ApiItemTypeEnum';
import getInitialContextualData from './getInitialContextualData';
import getNormalizedSubject from '../../utils/getNormalizedSubject';
import type InitialMeetingRequestData from './InitialMeetingRequestData';
import type InitialMessageReadData from './InitialMessageReadData';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';
import type Message from 'owa-service/lib/contract/Message';
import type { MessageReadAdapter } from 'owa-addins-adapters';
import RequestedCapabilities from 'owa-service/lib/contract/RequestedCapabilities';
import { convertRecurrenceToAddinFormat } from 'owa-addins-recurrence';
import { createAttachmentDetails } from 'owa-addins-apis-types';
import type { IAddinCommand } from 'owa-addins-store';
import {
    createEmailAddressDetails,
    createEmailAddressDetailsFromAttendeeType,
} from './EmailAddressDetails';

export default async function getInitialMessageReadData(
    adapter: MessageReadAdapter,
    addInCommand: IAddinCommand,
    hostItemIndex: string,
    data: InitialMessageReadData
): Promise<InitialMessageReadData> {
    const [message, messageId]: [Message, string] = await Promise.all([
        adapter.getItem() as Promise<Message>,
        adapter.getItemId(),
    ]);
    data.id = messageId;
    data.isRead = true;
    data.itemType = ApiItemTypeEnum.Message;
    data.itemClass = message.ItemClass;
    data.subject = message.Subject;
    data.normalizedSubject = getNormalizedSubject(message);
    data.conversationId = message.ConversationId.Id;
    data.internetMessageId = message.InternetMessageId;
    data.dateTimeCreated = message.DateTimeCreated
        ? new Date(message.DateTimeCreated).getTime()
        : null;
    data.dateTimeModified = message.LastModifiedTime
        ? new Date(message.LastModifiedTime).getTime()
        : null;
    data.dateTimeSent = message.DateTimeSent ? new Date(message.DateTimeSent).getTime() : null;
    data.attachments = message.Attachments ? createAttachmentDetails(message.Attachments) : [];
    data = await getInitialContextualData(hostItemIndex, message, addInCommand, data);

    if (addInCommand.extension.RequestedCapabilities != RequestedCapabilities.Restricted) {
        data.from = message.From ? createEmailAddressDetails(message.From.Mailbox) : null;
        data.sender = message.Sender ? createEmailAddressDetails(message.Sender.Mailbox) : null;
        data.to = message.ToRecipients ? message.ToRecipients.map(createEmailAddressDetails) : [];
        data.cc = message.CcRecipients ? message.CcRecipients.map(createEmailAddressDetails) : [];
        data.bcc = message.BccRecipients
            ? message.BccRecipients.map(createEmailAddressDetails)
            : [];

        if (isMeetingRequest(message)) {
            data = await getInitialUnrestrictedMeetingRequestData(adapter, data);
        }
    }

    return data;
}

function isMeetingRequest(message: Message): boolean {
    return (
        message.ItemClass.indexOf('IPM.Schedule.Meeting.Request') == 0 ||
        message.ItemClass.indexOf('IPM.Schedule.Meeting.Canceled') == 0
    );
}

async function getInitialUnrestrictedMeetingRequestData(
    adapter: MessageReadAdapter,
    data: InitialMeetingRequestData
): Promise<InitialMeetingRequestData> {
    const item = (await adapter.getItem()) as MeetingRequestMessageType;

    data.itemType = ApiItemTypeEnum.MeetingRequest;
    data.location = item.Location.DisplayName;
    data.start = item.Start;
    data.end = item.End;
    data.to = item.RequiredAttendees
        ? item.RequiredAttendees.map(createEmailAddressDetailsFromAttendeeType)
        : [];
    data.cc = item.OptionalAttendees
        ? item.OptionalAttendees.map(createEmailAddressDetailsFromAttendeeType)
        : [];
    data.resources = item.Resources
        ? item.Resources.map(createEmailAddressDetailsFromAttendeeType)
        : [];
    data.seriesId = await adapter.getSeriesId();
    const recurrenceType = await adapter.getRecurrence();
    data.recurrence = convertRecurrenceToAddinFormat({
        recurrenceType,
        timeZone: item.StartTimeZoneId,
        startTime: new Date(item.Start),
        endTime: new Date(item.End),
    });

    return data;
}
