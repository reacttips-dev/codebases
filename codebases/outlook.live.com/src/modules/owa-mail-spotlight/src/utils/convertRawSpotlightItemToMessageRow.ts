/**
 * Converts raw Spotlight item from API to message row.
 *
 * @param rawSpotlightItem item representation coming from service (untyped)
 * @param rowKey row key of item in inbox table
 */
export default function convertRawSpotlightItemToMessageRow(rawSpotlightItem: any, rowKey: string) {
    return {
        Categories: rawSpotlightItem.Categories,
        ConversationId: rawSpotlightItem.ConversationId && {
            Id: rawSpotlightItem.ConversationId.Id,
            ChangeKey: null,
        },
        ConversationIndex: rawSpotlightItem.ConversationIndex,
        DateTimeReceived: rawSpotlightItem.DateTimeReceived,
        DateTimeSent: rawSpotlightItem.DateTimeSent,
        LastModifiedTime: rawSpotlightItem.DateTimeLastModified,
        DisplayBcc: rawSpotlightItem.DisplayBcc,
        DisplayCc: rawSpotlightItem.DisplayCc,
        DisplayTo: rawSpotlightItem.DisplayTo,
        Flag: rawSpotlightItem.Flag && {
            FlagStatus: rawSpotlightItem.Flag.FlagStatus,
            CompleteDate: rawSpotlightItem.Flag.CompleteDate,
            DueDate: rawSpotlightItem.Flag.DueDate,
            StartDate: rawSpotlightItem.Flag.StartDate,
        },
        From: rawSpotlightItem.From && {
            Mailbox: {
                EmailAddress: rawSpotlightItem.From.EmailAddress.Address,
                Name: rawSpotlightItem.From.EmailAddress.Name,
                RoutingType: 'SMTP',
            },
        },
        HasAttachments: rawSpotlightItem.HasAttachments,
        Hashtags: rawSpotlightItem.Hashtags,
        Importance: rawSpotlightItem.Importance,
        IsDraft: rawSpotlightItem.IsDraft,
        IsRead: rawSpotlightItem.IsRead,
        ItemClass: rawSpotlightItem.ItemClass || 'IPM.Note',
        ItemId: {
            Id: rawSpotlightItem.ItemId.Id,
            ChangeKey: rawSpotlightItem.ItemId.ChangeKey,
        },
        ParentFolderId: rawSpotlightItem.ParentFolderId && {
            Id: rawSpotlightItem.ParentFolderId.Id,
        },
        Preview: rawSpotlightItem.Preview,
        Sender: rawSpotlightItem.Sender && {
            Mailbox: {
                EmailAddress: rawSpotlightItem.Sender.EmailAddress.Address,
                Name: rawSpotlightItem.Sender.EmailAddress.Name,
                RoutingType: 'SMTP',
            },
        },
        Sensitivity: rawSpotlightItem.Sensitivity,
        Subject: rawSpotlightItem.Subject,
        MentionedMe: rawSpotlightItem.MentionsPreview?.IsMentioned,
        InstanceKey: rowKey,
    };
}
