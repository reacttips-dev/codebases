import type SubstrateSearchRequest from '../../data/schema/SubstrateSearchRequest';
import type { SearchResultConversation } from '../../data/schema/SubstrateSearchResponse';
import type { ConversationType } from 'owa-graph-schema';
import {
    convertRecipientToSingleRecipientType,
    convertSearchSortOrder,
    convertToFolderId,
    convertToItemId,
    convertToItemIds,
    convertUtcDateTimeToRequestTimeZone,
} from './converterHelpers';

export default function convertSearchResultConversationToConversationType(
    searchConversation: SearchResultConversation,
    request: SubstrateSearchRequest
): ConversationType {
    return {
        __typename: 'ConversationType',
        Categories: searchConversation.Categories,
        ConversationId: convertToItemId(searchConversation.ConversationId),
        ConversationTopic: searchConversation.ConversationTopic,
        FlagStatus: searchConversation.FlagStatus,
        From: convertRecipientToSingleRecipientType(searchConversation.From),
        GlobalItemIds: convertToItemIds(searchConversation.GlobalItemIds),
        GlobalMessageCount: searchConversation.GlobalMessageCount,
        GlobalUnreadCount: searchConversation.GlobalUnreadCount,
        HasAttachments: searchConversation.HasAttachments,
        HasIrm: searchConversation.HasIrm,
        HasProcessedSharepointLink: searchConversation.HasProcessedSharepointLink,
        Importance: searchConversation.Importance,
        ItemClasses: searchConversation.ItemClasses,
        ItemIds: convertToItemIds(searchConversation.ItemIds),
        LastDeliveryOrRenewTime: convertUtcDateTimeToRequestTimeZone(
            searchConversation.LastDeliveryOrRenewTime,
            request
        ),
        LastDeliveryTime: convertUtcDateTimeToRequestTimeZone(
            searchConversation.LastDeliveryTime,
            request
        ),
        LastModifiedTime: convertUtcDateTimeToRequestTimeZone(
            searchConversation.LastModifiedTime,
            request
        ),
        MessageCount: searchConversation.MessageCount,
        ParentFolderId: convertToFolderId(searchConversation.ParentFolderId),
        Preview: searchConversation.Preview,
        SortOrderSource: convertSearchSortOrder(searchConversation.SortOrderSource),
        UniqueRecipients: searchConversation.UniqueRecipients,
        UniqueSenders: searchConversation.UniqueSenders,
        UnreadCount: searchConversation.UnreadCount,
    };
}
