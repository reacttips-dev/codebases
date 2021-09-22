import type { CalendarEvent as GqlCalendarEvent } from 'owa-graph-schema';
import type { CalendarEvent } from 'owa-calendar-types';
import type BusyType from 'owa-service/lib/contract/BusyType';
import { userDate } from 'owa-datetime';
import { createEmptyCalendarEvent } from 'owa-calendar-types/lib/types/CalendarEvent';
import { getUserMailboxInfo } from 'owa-client-ids';
import {
    convertAppendOnSendToOws,
    convertInboxRemindersToOws,
    convertRecurrenceTypeToOws,
} from 'convert-calendar-item';
import { convertDocLinkToOws, convertAttachmentToOws } from 'convert-attachment';
import type ResponseTypeType from 'owa-service/lib/contract/ResponseTypeType';

// TODO VSO 113957: Replace CalendarEvent client type with GraphQL CalendarEvent type
// This is will be temporary code to map the gql calendar event to the OWA Calendar Event
// which we can remove when we are consuming the gql CalendarEvent
export function mapGqlCalendarEventToOwaCalendarEvent(event: GqlCalendarEvent): CalendarEvent {
    return {
        ...createEmptyCalendarEvent(),
        ...event,
        // TODO VSO 122419: Replace OWS ClientItemId with graphql ClientItemId typw throughout calendar
        // Impacted fields: ItemId, ParentFolderId, SeriesMasterItemId
        ItemId: {
            mailboxInfo: event.ItemId?.mailboxInfo || getUserMailboxInfo(),
            Id: event.ItemId?.Id,
            ChangeKey: event.ItemId?.ChangeKey,
        },
        ParentFolderId: {
            mailboxInfo: event.ParentFolderId?.mailboxInfo || getUserMailboxInfo(),
            Id: event.ParentFolderId?.Id,
        },
        SeriesMasterItemId: event.SeriesMasterItemId
            ? {
                  mailboxInfo: event.SeriesMasterItemId.mailboxInfo || getUserMailboxInfo(),
                  Id: event.SeriesMasterItemId?.Id,
              }
            : undefined,
        // TODO VSO 122420: Replace OwaDate with graphql date type throughout calendar
        // Impacted fields: Start, End, AppointmentReplyTime ,LastModifiedTime
        Start: userDate(event.Start),
        End: userDate(event.End),
        AppointmentReplyTime: event.AppointmentReplyTime
            ? userDate(event.AppointmentReplyTime)
            : undefined,
        LastModifiedTime: event.LastModifiedTime ? userDate(event.LastModifiedTime) : undefined,
        // TODO VSO 122421: Replace OWS InboxReminders type with graphql InboxReminders type throughout calendar
        InboxReminders: event.InboxReminders?.map(convertInboxRemindersToOws),
        AutoRoomBookingStatus: event.AutoRoomBookingStatus,
        // TODO VSO 122422: Replace OWS AppendOnSend type with graphql AppendOnSend type throughout calendar
        AppendOnSend: event.AppendOnSend?.map(convertAppendOnSendToOws),
        // TODO VSO 122423: Replace OWS FreeBusyType type with graphql FreeBusyType type throughout calendar
        FreeBusyType: event.FreeBusyType as BusyType,
        // TODO VSO 122426: Replace OWS DocLinks type with graphql DocLinks type throughout calendar
        DocLinks: event.DocLinks?.map(convertDocLinkToOws),
        // TODO VSO 122424: Replace OWS recurrence type with graphql Recurrence type throughout calendar
        Recurrence: event.Recurrence && convertRecurrenceTypeToOws(event.Recurrence),
        // TODO VSO 122427: Remove or handle the dependency of calendar code on calendar event __type property
        __type: 'CalendarItem:#Exchange',
        // TODO VSO 122429: Replace OWS ResponseType type with graphql ResponseType type throughout calendar
        ResponseType: event.ResponseType as ResponseTypeType,
        // TODO VSO 122430: Replace OWS Attachments type with graphql Attachments type throughout calendar
        Attachments: event.Attachments?.map(convertAttachmentToOws),
    };
}
