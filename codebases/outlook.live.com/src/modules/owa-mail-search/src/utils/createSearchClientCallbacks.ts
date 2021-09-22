import { replyToMeeting } from 'owa-reply-to-meeting';
import {
    canEdit,
    canReply,
    canCancel,
    canForward,
    canDelete,
    canRespond,
    canProposeTime,
} from 'owa-calendar-event-capabilities';
import EventScope from 'owa-service/lib/contract/EventScope';
import { getUserMailboxInfo, ClientAttachmentId, ClientItemId } from 'owa-client-ids';
import { calendarEventsLockedStore } from '../store/lockedCalendarStore';
import { AttachmentSelectionSource } from 'owa-attachment-data';
import { downloadAttachment as downloadAttachmentFile } from 'owa-attachment-select-actions';
import { lazyOpenCalendarFullCompose } from 'owa-calendar-compose-form-lifecycle';
import { lazyPopoutCalendarCompose, lazyPopoutCalendarReadingPane } from 'owa-popout-calendar';
import {
    cancelCalendarEvent,
    deleteCalendarEvent,
    respondToCalendarEvent,
} from 'owa-calendar-events-actions';
import type ResponseTypeType from 'owa-service/lib/contract/ResponseTypeType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { useLivePersonaCard } from 'owa-persona/lib/components/PersonaCardBehavior';
import type { ClientActionCallbacks, ClientSize, ClientActionItem } from '@1js/search-hostapp-owa';
import { lazyGetAttachment } from 'owa-attachment-model-store';
import { TypeOfAttachment } from 'owa-attachment-type';
import { lazyCreateAttachmentViewState } from 'owa-attachment-well-data';
import { AttachmentFileType } from 'owa-attachment-file-types';
import { initializeAttachmentFullViewState } from 'owa-attachment-full-data';
import {
    lazyPreviewAttachmentInSxS,
    SxSReadingPaneInitializeMethod,
} from 'owa-attachment-preview-sxs-actions';
import { isSingleLineListView } from 'owa-mail-layout';
import { getCurrentTableMailboxInfo } from 'owa-mail-mailboxinfo';
import { lazyMoveReadingPaneToTab } from 'owa-mail-reading-pane-store';
import { getStore as getMailStore, getItem } from 'owa-mail-store';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { lazyLoadItem } from 'owa-mail-store-actions';
import { lazyForwardItem, lazyNewMessage } from 'owa-mail-message-actions';
import { userDate, formatUserDate, formatUserTime, formatWeekDayDate, OwaDate } from 'owa-datetime';
import { onAnswerRendered } from '../actions/publicActions';
import { addSuggestionPill, startSearch } from 'owa-search-actions';
import { SearchScenarioId } from 'owa-search-store';
import { SuggestionKind, PeopleSuggestion } from 'owa-search-service';
import { shareByEmail as shareViaEmail } from 'owa-attachment-sharebyemail';
import { createAttachmentFileFromAttachmentData } from 'owa-fileshub-store/lib/utils/createAttachmentFileFromAttachmentData';
import { ComposeTarget } from 'owa-mail-compose-store';
import getPersonaPhotoUrl from 'owa-persona/lib/utils/getPersonaPhotoUrl';
import { convertRestIdToEwsId } from 'owa-identifiers';
import { lazyActivateTab, primaryTab } from 'owa-tab-store';
import { copyLinkToClipboard } from 'owa-attachment-full-view/lib/utils/ContextMenu/copyLinkContextMenuItemBuilder';
import { CalendarComponent } from 'owa-calendar-usage-instrumentation';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import { lazyOpenConflictsView } from 'owa-time-panel';
import MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';

const ACTION_SOURCE = 'CalendarAnswer';

export function createSearchClientCallbacks(): ClientActionCallbacks {
    return {
        canReply: canReplyEvent,
        canCancel: canCancelEvent,
        canForward: canForwardEvent,
        canEdit: canEditEvent,
        canDelete: canDeleteEvent,
        canRsvp,
        canProposeNewTime,
        openEvent: onOpenEvent,
        reply: onReply,
        replyAll: onReplyAll,
        cancelEvent: onCancelEvent,
        editEvent: onEditEvent,
        forwardEvent: onForwardEvent,
        deleteEvent: onDeleteEvent,
        rsvpEvent: onResponseClick,
        proposeNewTime: onProposeNewTimeClick,
        joinMeeting: onJoinMeetingClick,
        scheduleNextMeeting: onScheduleNextMeetingClick,
        livePersonaCard: useLivePersonaCard,
        openAttachmentInClient,
        openMail,
        forwardMail,
        composeEmail,
        dateTimeFormatter,
        userEmail,
        setAnswerBlockRendered: onAnswerRendered,
        startPersonSearchRequery,
        shareByEmail,
        getCurrentClientSize,
        getProfilePhotoUrl,
        downloadAttachment,
        copyLink,
        onConflictClick,
    };
}

const userEmail = getUserConfiguration().SessionSettings.UserEmailAddress;

async function canReplyEvent(clientActionItem: ClientActionItem) {
    const { itemId } = clientActionItem;
    const event = await getFullEvent(itemId);
    return event && canReply(event);
}

async function canCancelEvent(clientActionItem: ClientActionItem) {
    const { itemId } = clientActionItem;
    const event = await getFullEvent(itemId);
    return event && canCancel(event);
}

async function canEditEvent(clientActionItem: ClientActionItem) {
    const { itemId } = clientActionItem;
    const event = await getFullEvent(itemId);
    return event && canEdit(event);
}

async function canForwardEvent(clientActionItem: ClientActionItem) {
    const { itemId } = clientActionItem;
    const event = await getFullEvent(itemId);
    return event && canForward(event);
}

async function canDeleteEvent(clientActionItem: ClientActionItem) {
    const { itemId } = clientActionItem;
    const event = await getFullEvent(itemId);
    return event && canDelete(event);
}

async function canRsvp(clientActionItem: ClientActionItem) {
    const { itemId } = clientActionItem;
    const event = await getFullEvent(itemId);
    return event && canRespond(event);
}

async function canProposeNewTime(clientActionItem: ClientActionItem) {
    const { itemId } = clientActionItem;
    const event = await getFullEvent(itemId);
    return event && canProposeTime(event);
}

async function onOpenEvent(clientActionItem: ClientActionItem) {
    const { itemId } = clientActionItem;
    const event = await getFullEvent(itemId);
    if (!event) {
        return;
    }
    lazyPopoutCalendarReadingPane.importAndExecute(event.ItemId, ACTION_SOURCE, null /* data */);
}

async function onReplyAll(clientActionItem: ClientActionItem) {
    const { itemId } = clientActionItem;
    const event = await getFullEvent(itemId);
    event && canReply(event) && replyToMeeting(event, true, ACTION_SOURCE);
}

async function onReply(clientActionItem: ClientActionItem) {
    const { itemId } = clientActionItem;
    const event = await getFullEvent(itemId);
    event && canReply(event) && replyToMeeting(event, false, ACTION_SOURCE);
}

async function onCancelEvent(clientActionItem: ClientActionItem) {
    const { itemId } = clientActionItem;
    const event = await getFullEvent(itemId);
    if (event && canCancel(event)) {
        cancelCalendarEvent(
            event.ItemId,
            ACTION_SOURCE,
            EventScope.ThisInstanceOnly,
            CalendarComponent.SearchResultsActions,
            ''
        );
        return true;
    }
    return false;
}

async function onDeleteEvent(clientActionItem: ClientActionItem) {
    const { itemId } = clientActionItem;
    const event = await getFullEvent(itemId);
    if (event && canDelete(event)) {
        deleteCalendarEvent(event, ACTION_SOURCE, EventScope.ThisInstanceOnly);
        return true;
    }
    return false;
}

async function onEditEvent(clientActionItem: ClientActionItem) {
    const { itemId } = clientActionItem;
    const event = await getFullEvent(itemId);

    if (!event || !canEdit(event)) {
        return;
    }

    lazyOpenCalendarFullCompose.importAndExecute({
        fullComposeEntrySource: ACTION_SOURCE,
        eventUpdates: event,
        itemHasUpdates: true,
    });
}

async function onForwardEvent(clientActionItem: ClientActionItem) {
    const { itemId } = clientActionItem;
    const event = await getFullEvent(itemId);

    if (!event || !canForward(event)) {
        return;
    }

    lazyPopoutCalendarReadingPane.importAndExecute(event.ItemId, ACTION_SOURCE, {
        isForward: true,
    });
}

async function onResponseClick(clientActionItem: ClientActionItem, responseType: ResponseTypeType) {
    const { itemId } = clientActionItem;
    const event = await getFullEvent(itemId);

    if (!event || !canRespond(event)) {
        return false;
    }

    respondToCalendarEvent(
        event.ItemId,
        event.ResponseType,
        responseType,
        event.FreeBusyType,
        EventScope.ThisInstanceOnly,
        false /* Send Message */,
        ACTION_SOURCE
    );

    return true;
}

async function onProposeNewTimeClick(
    clientActionItem: ClientActionItem,
    responseType: ResponseTypeType
) {
    const { itemId } = clientActionItem;
    const event = await getFullEvent(itemId);

    if (!event || !canProposeTime(event)) {
        return false;
    }

    lazyPopoutCalendarReadingPane.importAndExecute(event.ItemId, ACTION_SOURCE, {
        responseType: responseType,
    });
    return true;
}

function onJoinMeetingClick(clientActionItem: ClientActionItem) {
    window.open(clientActionItem.onlineMeetingUrl, '_blank');
}

async function onScheduleNextMeetingClick(clientActionItem: ClientActionItem) {
    const { itemId } = clientActionItem;
    const event = await getFullEvent(itemId);

    if (!event) {
        return;
    }

    // TODO: CAL-PROJECTION Duplicate and projection
    lazyPopoutCalendarCompose.importAndExecute(
        event,
        ACTION_SOURCE,
        true /* eventHasUpdates */,
        true /* shouldDuplicate */
    );
}

async function openAttachmentInClient(clientActionItem: ClientActionItem) {
    const { attachmentId, accessUrl, itemId } = clientActionItem;
    const ewsAttachementId = convertRestIdToEwsId(attachmentId);

    if (attachmentId) {
        const itemIdInfo: ClientItemId = {
            Id: itemId,
            mailboxInfo: getUserMailboxInfo(),
        };

        const attachmentIdInfo: ClientAttachmentId = {
            Id: ewsAttachementId,
            mailboxInfo: getUserMailboxInfo(),
        };

        const createAttachmentViewState = await lazyCreateAttachmentViewState.import();
        const getAttachment = await lazyGetAttachment.import();
        const attachment = getAttachment(attachmentIdInfo);

        if (!attachment) {
            window.open(accessUrl);
            return;
        }

        const attachmentViewState = createAttachmentViewState(
            attachmentIdInfo,
            true, // isReadOnly
            true, // uploadCompleted
            attachment.type === TypeOfAttachment.Reference,
            AttachmentFileType.MailSearchFileSuggestion
        );

        initializeAttachmentFullViewState(
            attachmentViewState,
            attachment,
            false,
            attachmentViewState.strategy.supportedMenuActions
        );
        await lazyActivateTab.importAndExecute(primaryTab);

        lazyPreviewAttachmentInSxS.importAndExecute(
            attachmentViewState,
            itemIdInfo,
            false,
            false,
            AttachmentSelectionSource.FilesHub,
            null,
            {
                method: SxSReadingPaneInitializeMethod.LoadItemReadingPane,
                itemId: itemIdInfo,
            },
            null,
            window
        );
    } else {
        window.open(accessUrl);
    }
}

async function getFullEvent(itemId?: string) {
    if (!itemId) {
        return null;
    }
    try {
        let { event, fullEventPromise } = calendarEventsLockedStore.fetchFullCalendarEvent(
            {
                Id: itemId,
                mailboxInfo: getUserMailboxInfo(null),
            },
            undefined /** folderId */,
            undefined /**getExistingCalendarEvent */,
            undefined /** isfetchFullSeriesMasterCalendarEventFromEventInstance */,
            { fetchSource: 'AnswersSearch' }
        );
        if (!event) {
            event = await fullEventPromise;
        }
        return event;
    } catch (error) {
        // handle error
        return null;
    }
}

async function openMail(clientActionItem: ClientActionItem) {
    const { itemId } = clientActionItem;
    if (!itemId) {
        return;
    }
    await openMailItem(itemId);

    const mailData = getMailStore().items.get(itemId);
    const clientItemId: ClientItemId = {
        Id: itemId,
        mailboxInfo: getCurrentTableMailboxInfo(),
    };

    await openItemInNewTab(clientItemId, mailData.Subject);
}

async function forwardMail(clientActionItem: ClientActionItem) {
    const { itemId } = clientActionItem;
    if (!itemId) {
        return;
    }
    await openMailItem(itemId);

    const clientItemId: ClientItemId = {
        Id: itemId,
        mailboxInfo: getCurrentTableMailboxInfo(),
    };

    await lazyForwardItem.importAndExecute(clientItemId, null, null, false);
}

async function openMailItem(itemId: string) {
    const clientItemId: ClientItemId = {
        Id: itemId,
        mailboxInfo: getCurrentTableMailboxInfo(),
    };

    const cachedItem = getMailStore().items.get(itemId);

    if (cachedItem?.NormalizedBody) {
        return;
    } else {
        await lazyLoadItem.importAndExecute(clientItemId, 'LoadItemReadingPaneSearch');
    }
}

async function openItemInNewTab(itemId: ClientItemId, subject: string) {
    await lazyMoveReadingPaneToTab.importAndExecute(
        itemId,
        subject,
        [] /*categories*/,
        true /*makeActive*/,
        null /*instrumentation context */,
        ReactListViewType.Message
    );
}

function parseDate(dateTimeString: string) {
    try {
        return userDate(dateTimeString);
    } catch {
        return null;
    }
}

function formatDateTimeUtil(date: string, dateFunction: (date: OwaDate) => string): string {
    const displayDate = parseDate(date);

    if (!displayDate) {
        return '';
    }

    return dateFunction(displayDate);
}

function formatUserDateUtil(date: string) {
    return formatDateTimeUtil(date, formatUserDate);
}

function formatUserTimeUtil(date: string) {
    return formatDateTimeUtil(date, formatUserTime);
}

function formatWeekDayDateUtil(date: string) {
    return formatDateTimeUtil(date, formatWeekDayDate);
}

function startPersonSearchRequery(email: string, displayName?: string) {
    const suggestion: PeopleSuggestion = {
        kind: SuggestionKind.People,
        Attributes: undefined,
        HighlightedDisplayName: displayName,
        DisplayName: displayName,
        EmailAddresses: [email],
        ReferenceId: '',
        Source: 'peopleAnswer',
    };
    addSuggestionPill(suggestion, true /* suggestionSelected */, SearchScenarioId.Mail);

    // Kick off search with selected suggestion.
    startSearch('PeopleAnswer', SearchScenarioId.Mail, false /* explicitSearch */);
}

async function shareByEmail(attachmentId: string) {
    const attachmentIdInfo: ClientAttachmentId = {
        Id: attachmentId,
        mailboxInfo: getUserMailboxInfo(),
    };

    const attachmentFile = await createAttachmentFileFromAttachmentData(attachmentIdInfo);
    shareViaEmail([attachmentFile], ComposeTarget.Popout);
}

function composeEmail(body: string) {
    lazyNewMessage.importAndExecute(
        'FileAnswer',
        undefined /* groupId */,
        undefined /* toEmailAddressWrappers */,
        undefined /* subject */,
        body
    );
}

const dateTimeFormatter = {
    formatUserTime: formatUserTimeUtil,
    formatUserDate: formatUserDateUtil,
    formatWeekDayDate: formatWeekDayDateUtil,
};

function getCurrentClientSize(): ClientSize {
    return isSingleLineListView() ? 'Large' : 'Small';
}

function getProfilePhotoUrl(emailAddress: string) {
    return getPersonaPhotoUrl(emailAddress);
}

function copyLink(url: string): void {
    copyLinkToClipboard(url, window);
}

function downloadAttachment(clientActionItem: ClientActionItem, isCloudy?: boolean): void {
    const attachmentIdInfo: ClientAttachmentId = {
        Id: clientActionItem.attachmentId,
        mailboxInfo: getUserMailboxInfo(),
    };
    downloadAttachmentFile(attachmentIdInfo, isCloudy);
}

const meetingDetailsProperties = [
    propertyUri({ FieldURI: 'Start' }),
    propertyUri({ FieldURI: 'End' }),
    propertyUri({ FieldURI: 'AssociatedCalendarItemId' }),
    propertyUri({ FieldURI: 'RecurrenceId' }),
    propertyUri({ FieldURI: 'Recurrence' }),
    propertyUri({ FieldURI: 'ConflictingMeetings' }),
    propertyUri({ FieldURI: 'AdjacentMeetings' }),
    propertyUri({ FieldURI: 'CalendarItemType' }),
    propertyUri({ FieldURI: 'IsResponseRequested' }),
    propertyUri({ FieldURI: 'Organizer' }),
    propertyUri({ FieldURI: 'ItemClass' }),
    propertyUri({ FieldURI: 'MeetingRequestType' }),
    propertyUri({ FieldURI: 'ItemParentId' }),
    propertyUri({ FieldURI: 'Sender' }),
    propertyUri({ FieldURI: 'ConversationId' }),
    propertyUri({ FieldURI: 'IsDelegated' }),
    propertyUri({ FieldURI: 'ReceivedRepresenting' }),
    propertyUri({ FieldURI: 'ResponseType' }),
];

async function onConflictClick(clientActionItem: ClientActionItem) {
    const { itemId, startTime, endTime } = clientActionItem;

    const itemIdString = [itemId];
    const item = await getItem(
        itemIdString,
        itemResponseShape({
            BaseShape: 'IdOnly',
            AdditionalProperties: meetingDetailsProperties,
        }),
        null
    );

    const itemToSend = {
        ...item[0],
        AssociatedCalendarItemId: item[0].ItemId,
        Start: startTime,
        End: endTime,
    };

    lazyOpenConflictsView.importAndExecute(
        'ShowConflicts',
        itemToSend as MeetingRequestMessageType
    );
}
