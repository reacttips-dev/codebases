import type { AttachmentFileAttributes } from 'owa-attachment-file-types';
import { userInteractionAction, ViewType } from 'owa-calendar-actions';
import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import messageType from 'owa-service/lib/factory/message';
import { isOnGroupCalendar } from 'owa-calendar-event-capabilities';
import { lazyReplyToMessageAndCreateViewState } from 'owa-mail-compose-actions';
import { popoutCompose } from 'owa-mail-compose-command';
import { ComposeTarget } from 'owa-mail-compose-store';

/**
 * The action worker which handles reply to a calendar event.
 */
export default async function replyToMeeting(
    event: CalendarEvent,
    isReplyAll: boolean,
    actionSource: ViewType,
    replyBody?: string,
    attachmentFiles?: AttachmentFileAttributes[]
) {
    let referenceItem = messageType({
        ItemId: event.ItemId,
        From: event.Organizer,
        ToRecipients: (event.RequiredAttendees || []).map(attendee => attendee.Mailbox),
        CcRecipients: (event.OptionalAttendees || []).map(attendee => attendee.Mailbox),
        Subject: event.Subject,
        ConversationId: event.ConversationId ? event.ConversationId : null,
    });

    // raise an event that user interacted with this event, even though user might not actually send the reply
    isReplyAll
        ? userInteractionAction('ReplyAll', actionSource, event.IsOrganizer, event.IsMeeting)
        : userInteractionAction('Reply', actionSource, event.IsOrganizer, event.IsMeeting);

    const replyToMessageAndCreateViewState = await lazyReplyToMessageAndCreateViewState.import();
    const viewState = await replyToMessageAndCreateViewState({
        referenceItemOrId: referenceItem,
        attachmentFiles: attachmentFiles,
        body: replyBody,
        groupId: getGroupSmtpAddress(event) /* groupSmtpAddress is called groupId in mail */,
        isReplyAll: isReplyAll,
        useFullCompose: true,
        fullComposeTarget: ComposeTarget.SecondaryTab,
        instrumentationContexts: null,
    });

    popoutCompose(viewState);
}

function getGroupSmtpAddress(event: CalendarEvent): string | null {
    if (!isOnGroupCalendar(event)) {
        // If event is not on group calendar, return null
        return null;
    }
    return event.ParentFolderId.mailboxInfo?.mailboxSmtpAddress;
}
