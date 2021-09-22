/**
 * Converts raw Spotlight item from API to conversation row.
 *
 * @param rawSpotlightItem item representation coming from service (untyped)
 * @param rowKey row key of item in inbox table
 */
export default function convertRawSpotlightItemToConversationRow(
    rawSpotlightItem: any,
    rowKey: string
) {
    /**
     * We're using 1 for GlobalMessageCount and MessageCount because we are
     * building the conversation from a single message and don't have this info
     * so we can only be sure that the conversation has at least 1 item in it.
     */
    return {
        Categories: rawSpotlightItem.Categories,
        ConversationId: rawSpotlightItem.ConversationId && {
            Id: rawSpotlightItem.ConversationId.Id,
            ChangeKey: null,
        },
        ConversationTopic: rawSpotlightItem.Subject,
        FlagStatus: rawSpotlightItem.Flag?.FlagStatus,
        FolderId: rawSpotlightItem.ParentFolderId && {
            Id: rawSpotlightItem.ParentFolderId.Id,
        },
        From: rawSpotlightItem.From && {
            Mailbox: {
                EmailAddress: rawSpotlightItem.From.EmailAddress.Address,
                Name: rawSpotlightItem.From.EmailAddress.Name,
                RoutingType: 'SMTP',
            },
        },
        GlobalItemIds: [
            {
                Id: rawSpotlightItem.ItemId.Id,
                ChangeKey: null,
            },
        ],
        GlobalMessageCount: 1,
        /**
         * Since we're building a conversation from a single item, we can only
         * know the unread count based off of the single item.
         */
        GlobalUnreadCount: rawSpotlightItem.IsRead ? 0 : 1,
        HasAttachments: rawSpotlightItem.HasAttachments,
        Hashtags: rawSpotlightItem.Hashtags,
        HasIrm: null,
        Importance: rawSpotlightItem.Importance,
        ItemClasses: rawSpotlightItem.ItemClasses || ['IPM.Note'],
        ItemIds: [
            {
                Id: rawSpotlightItem.ItemId.Id,
                ChangeKey: null,
            },
        ],
        LastDeliveryOrRenewTime: rawSpotlightItem.DateTimeReceived,
        LastDeliveryTime: rawSpotlightItem.DateTimeReceived,
        LastModifiedTime: rawSpotlightItem.DateTimeLastModified,
        MessageCount: 1,
        ParentFolderId: rawSpotlightItem.ParentFolderId && {
            Id: rawSpotlightItem.ParentFolderId.Id,
        },
        Preview: rawSpotlightItem.Preview,
        SenderSMTPAddress: rawSpotlightItem.Sender?.EmailAddress?.Address,
        UniqueSenders: [rawSpotlightItem.Sender?.EmailAddress?.Name],
        /**
         * Since we're building a conversation from a single item, we can only
         * know the unread count based off of the single item.
         */
        UnreadCount: rawSpotlightItem.IsRead ? 0 : 1,
        InstanceKey: rowKey,
    };
}
