import type * as Schema from 'owa-graph-schema';
import type Item from 'owa-service/lib/contract/Item';
import type Message from 'owa-service/lib/contract/Message';

export function mapOwsItemToGqlItemRow(item: Item): Schema.ItemRow {
    let itemRow: Schema.ItemRow = {
        __typename: 'ItemRow',
        ItemId: {
            Id: item.ItemId!.Id,
            ChangeKey: item.ItemId!.ChangeKey,
        },
        Categories: item.Categories,
        ConversationId: {
            Id: item.ConversationId!.Id,
        },
        DateTimeReceived: item.DateTimeReceived,
        DateTimeSent: item.DateTimeSent,
        DisplayTo: item.DisplayTo,
        EntityNamesMap: item.EntityNamesMap,
        Flag: item.Flag,
        HasAttachments: item.HasAttachments,
        HasProcessedSharepointLink: item.HasProcessedSharepointLink,
        IconIndex: item.IconIndex,
        Importance: item.Importance,
        InstanceKey: item.InstanceKey,
        IsDraft: item.IsDraft,
        IsExternalSender: item.IsExternalSender,
        ItemClass: item.ItemClass,
        LastModifiedTime: item.LastModifiedTime,
        MentionedMe: item.MentionedMe,
        ParentFolderId: item.ParentFolderId
            ? {
                  __typename: 'FolderId',
                  Id: item.ParentFolderId.Id,
              }
            : undefined,
        Preview: item.Preview,
        ReceivedOrRenewTime: item.ReceivedOrRenewTime,
        ReturnTime: item.ReturnTime,
        Sensitivity: item.Sensitivity,
        Size: item.Size,
        SortOrderSource: item.SortOrderSource,
        SpotlightIsVisible: item.SpotlightIsVisible,
        Subject: item.Subject,
        SystemCategories: item.SystemCategories,
        id: item.ItemId!.Id,
    };

    // Message specific updates
    if (
        !item?.ItemClass || // server treats undefined or null ItemClass as a Message type by default
        item.ItemClass.indexOf('IPM.Note') !== -1 || // Normal messages
        item.ItemClass.indexOf('IPM.Schedule.Meeting') !== -1 || // Meeting request messages
        item.ItemClass.indexOf('IPM.GroupMailbox.JoinRequest') !== -1 || // Group join request messages
        item.ItemClass.indexOf('IPM.Post') !== -1 || //Post Message type
        item.ItemClass.indexOf('IPM.Sharing') !== -1 // Calendar Sharing Message Type
    ) {
        const message = item as Message;

        itemRow.From = message.From;
        itemRow.IsRead = message.IsRead;
        itemRow.IsReadReceiptRequested = message.IsReadReceiptRequested;
        itemRow.IsDeliveryReceiptRequested = message.IsDeliveryReceiptRequested;
        itemRow.LikeCount = message.LikeCount;
        itemRow.AntispamUnauthenticatedSender = message.AntispamUnauthenticatedSender;
    }

    return itemRow;
}
