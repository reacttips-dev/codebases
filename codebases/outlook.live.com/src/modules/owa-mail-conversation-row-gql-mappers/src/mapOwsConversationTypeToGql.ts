import type * as Schema from 'owa-graph-schema';
import { TAG_EMAIL_HASHTAG } from 'owa-mail-fetch-tagged-email';
import type ConverationType from 'owa-service/lib/contract/ConversationType';

export function mapOwsConversationTypeToGql(conv: ConverationType): Schema.ConversationType {
    return {
        __typename: 'ConversationType',
        ConversationId: {
            Id: conv.ConversationId!.Id,
        },
        ConversationTopic: conv.ConversationTopic ?? '',
        UniqueRecipients: conv.UniqueRecipients,
        UniqueSenders: conv.UniqueSenders,
        LastDeliveryTime: conv.LastDeliveryTime ?? '',
        Categories: conv.Categories,
        FlagStatus: conv.FlagStatus,
        FlagStatusV2: conv.FlagStatusV2,
        HasAttachments: conv.HasAttachments,
        MessageCount: conv.MessageCount,
        GlobalMessageCount: conv.GlobalMessageCount,
        UnreadCount: conv.UnreadCount ?? 0,
        GlobalUnreadCount: conv.GlobalUnreadCount,
        Size: conv.Size,
        ItemClasses: conv.ItemClasses,
        Importance: conv.Importance,
        ItemIds: conv.ItemIds,
        GlobalItemIds: conv.GlobalItemIds,
        LastModifiedTime: conv.LastModifiedTime,
        InstanceKey: conv.InstanceKey,
        Preview: conv.Preview,
        IconIndex: conv.IconIndex,
        DraftItemIds: conv.DraftItemIds,
        HasIrm: conv.HasIrm,
        GlobalLikeCount: conv.GlobalLikeCount,
        LastDeliveryOrRenewTime: conv.LastDeliveryOrRenewTime ?? '',
        LastSentTime: conv.LastSentTime ?? '',
        GlobalMentionedMe: conv.GlobalMentionedMe,
        GlobalAtAllMention: conv.GlobalAtAllMention,
        SortOrderSource: conv.SortOrderSource,
        SpotlightIsVisible: conv.SpotlightIsVisible,
        LastSender: conv.LastSender,
        From: conv.From,
        ParentFolderId: conv.ParentFolderId
            ? {
                  __typename: 'FolderId',
                  Id: conv.ParentFolderId.Id,
              }
            : undefined,
        EntityNamesMap: conv.EntityNamesMap,
        HasExternalEmails: conv.HasExternalEmails,
        ReturnTime: conv.ReturnTime,
        IsTaggedForBigScreen: conv.Hashtags && conv.Hashtags.indexOf(TAG_EMAIL_HASHTAG) >= 0,
        HasSharepointLink: conv.HasSharepointLink,
        HasAttachmentPreviews: conv.HasAttachmentPreviews,
        HasProcessedSharepointLink: conv.HasProcessedSharepointLink,
        CouponRanks: conv.CouponRanks,
        CouponExpiryDates: conv.CouponExpiryDates,
        mentionedMe: conv.GlobalMentionedMe || conv.GlobalAtAllMention,
        id: conv.ConversationId!.Id,
    };
}
