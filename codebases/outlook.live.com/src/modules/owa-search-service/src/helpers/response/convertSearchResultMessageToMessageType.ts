import type SubstrateSearchRequest from '../../data/schema/SubstrateSearchRequest';
import type { SearchResultMessage } from '../../data/schema/SubstrateSearchResponse';
import type Message from 'owa-service/lib/contract/Message';
import {
    convertToNormalizedSubject,
    convertToItemId,
    convertUtcDateTimeToRequestTimeZone,
    convertToFlagType,
    convertRecipientToSingleRecipientType,
    convertToFolderId,
    convertSearchSortOrder,
} from './converterHelpers';
import { isFeatureEnabled } from 'owa-feature-flags';
import { convertRestIdToEwsId } from 'owa-identifiers';

export default function convertSearchResultMessageToMessageType(
    searchMessage: SearchResultMessage,
    request: SubstrateSearchRequest
): Message {
    const normalizedSubject = convertToNormalizedSubject(searchMessage.Subject);
    const normalizedItemId = isFeatureEnabled('fwk-immutable-ids')
        ? searchMessage.ImmutableId
            ? { Id: convertRestIdToEwsId(searchMessage.ImmutableId), ChangeKey: null }
            : searchMessage.ItemId
        : searchMessage.ItemId;

    return {
        Categories: searchMessage.Categories,
        ConversationId: convertToItemId(searchMessage.ConversationId),
        ConversationIndex: searchMessage.ConversationIndex,
        ConversationThreadId: {
            Id: searchMessage.ConversationThreadId,
            ChangeKey: null,
        },
        ConversationTopic: normalizedSubject,
        DateTimeReceived: convertUtcDateTimeToRequestTimeZone(
            searchMessage.DateTimeReceived,
            request
        ),
        DateTimeSent:
            searchMessage.DateTimeSent &&
            convertUtcDateTimeToRequestTimeZone(searchMessage.DateTimeSent, request),
        LastModifiedTime: convertUtcDateTimeToRequestTimeZone(
            searchMessage.DateTimeLastModified,
            request
        ),
        DisplayBcc: searchMessage.DisplayBcc,
        DisplayCc: searchMessage.DisplayCc,
        DisplayTo: searchMessage.DisplayTo,
        Flag: convertToFlagType(searchMessage.Flag),
        From: convertRecipientToSingleRecipientType(searchMessage.From),
        HasAttachments: searchMessage.HasAttachments,
        Hashtags: searchMessage.Hashtags,
        IconIndex: searchMessage.IconIndex,
        Importance: searchMessage.Importance,
        IsDraft: searchMessage.IsDraft,
        IsRead: searchMessage.IsRead,
        ItemClass: searchMessage.ItemClass || 'IPM.Note',
        ItemId: normalizedItemId,
        MailboxGuids: searchMessage.MailboxGuids,
        ParentFolderId: convertToFolderId(searchMessage.ParentFolderId),
        Preview: searchMessage.Preview,
        Sender: convertRecipientToSingleRecipientType(searchMessage.Sender),
        SenderSMTPAddress: searchMessage.SenderSMTPAddress,
        Sensitivity: searchMessage.Sensitivity,
        SerializedImmutableId: searchMessage.ImmutableId,
        SortOrderSource: convertSearchSortOrder(searchMessage.SortOrderSource),
        Subject: searchMessage.Subject,
        MentionedMe: searchMessage.MentionsPreview?.IsMentioned,
        ExtendedProperty: [
            {
                // WellKnownProperties.NormalizedSubjectProperty
                ExtendedFieldURI: {
                    DistinguishedPropertySetId: 'Common',
                    PropertyId: 3613,
                    PropertyType: 'String',
                },
                Value: normalizedSubject,
            },
        ],
    };
}
