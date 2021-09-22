import type { ConversationType } from 'owa-graph-schema';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type { TableView } from 'owa-mail-list-store';
import type TableViewConversationRelation from 'owa-mail-list-store/lib/store/schema/TableViewConversationRelation';
import getShouldShowRSVPForConversationAndPrepareItem from 'owa-listview-rsvp/lib/utils/getShouldShowRSVPForConversationAndPrepareItem';
import type FlagStatus from 'owa-service/lib/contract/FlagStatus';
import { isFeatureEnabled } from 'owa-feature-flags';

function getEffectiveMentioned(conversationType: ConversationType): boolean {
    return conversationType.GlobalMentionedMe || conversationType.GlobalAtAllMention;
}

function getFlagStatus(conversationType: ConversationType): FlagStatus {
    return isFeatureEnabled('tri-flagStatusV2') && conversationType.FlagStatusV2
        ? conversationType.FlagStatusV2
        : conversationType.FlagStatus;
}

export default function mapConversationTypeToConversationRelation(
    conversationType: ConversationType,
    tableView: TableView
): TableViewConversationRelation {
    return <TableViewConversationRelation>{
        categories: conversationType.Categories,
        draftItemIds: conversationType.DraftItemIds
            ? conversationType.DraftItemIds.map(baseDraftItemId => (<ItemId>baseDraftItemId).Id)
            : [],
        effectiveMentioned: getEffectiveMentioned(conversationType),
        executeSearchSortOrder: conversationType.SortOrderSource,
        flagStatus: getFlagStatus(conversationType),
        hasAttachments: conversationType.HasAttachments,
        isTaggedForBigScreen: conversationType.IsTaggedForBigScreen,
        hasIrm: conversationType.HasIrm,
        iconIndex: conversationType.IconIndex,
        id: conversationType.ConversationId.Id,
        importance: conversationType.Importance,
        instanceKey: conversationType.InstanceKey,
        itemClasses: conversationType.ItemClasses,
        itemIds: conversationType.ItemIds.map(baseItemId => (<ItemId>baseItemId).Id),
        lastDeliveryOrRenewTimeStamp: conversationType.LastDeliveryOrRenewTime,
        lastDeliveryTimeStamp: conversationType.LastDeliveryTime,
        lastSentTimeStamp: conversationType.LastSentTime || conversationType.LastDeliveryTime, // LastSentTime is undefined for search result. Fallback to LastDeliveryTime
        lastModifiedTimeStamp: conversationType.LastModifiedTime,
        lastSender: conversationType.LastSender
            ? conversationType.LastSender
            : conversationType.From, // lastSender is null in search response, use From instead
        parentFolderId: conversationType.ParentFolderId ? conversationType.ParentFolderId.Id : null, // This value only exists in search items
        previewText: conversationType.Preview,
        returnTime: conversationType.ReturnTime ? conversationType.ReturnTime : null,
        uniqueRecipients: conversationType.UniqueRecipients,
        uniqueSenders: conversationType.UniqueSenders,
        unreadCount: conversationType.UnreadCount,
        globalLikeCount: conversationType.GlobalLikeCount ? conversationType.GlobalLikeCount : null,
        shouldShowRSVP: getShouldShowRSVPForConversationAndPrepareItem(conversationType, tableView),
        spotlightIsVisible: conversationType.SpotlightIsVisible,
    };
}
