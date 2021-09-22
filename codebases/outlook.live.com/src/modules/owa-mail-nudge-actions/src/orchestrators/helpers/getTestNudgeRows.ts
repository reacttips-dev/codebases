export function getTestNudgeRowDataForRowNotLoadedInTableView() {
    return {
        ConversationId: {
            __type: 'ItemId:#Exchange',
            Id: 'getTestNudgeRowDataForRowNotLoadedInTableViewConversationId=',
        },
        ConversationTopic: 'This is a test Nudge Email that is older than the loaded rows',
        UniqueSenders: ['Sayali Shah'],
        LastDeliveryTime: '2019-10-01T15:30:58-07:00',
        HasAttachments: false,
        MessageCount: 1,
        GlobalMessageCount: 1,
        UnreadCount: 1,
        GlobalUnreadCount: 1,
        Size: 1234,
        ItemClasses: ['IPM.Note'],
        Importance: null,
        ItemIds: [
            {
                __type: 'ItemId:#Exchange',
                ChangeKey: 'CQAAAA==',
                Id: 'getTestNudgeRowDataForRowNotLoadedInTableViewItemId=',
            },
        ],
        GlobalItemIds: [
            {
                __type: 'ItemId:#Exchange',
                ChangeKey: 'CQAAAA==',
                Id: 'getTestNudgeRowDataForRowNotLoadedInTableViewItemId=',
            },
        ],
        LastModifiedTime: '2019-10-29T15:30:59-07:00',
        InstanceKey: 'testNudgeRowKey',
        Preview: 'Test nudge email for row that is not loaded',
        HasIrm: false,
        IsLocked: false,
        FamilyId: {
            __type: 'ItemId:#Exchange',
            Id: 'AAQkAGZjM2NmMGY1LTkzMzgtNGNhMy04ODg5LWQwMjJjMDc0YjJlMAAQAH9+ZbR0rbRFncY81mWHT1E=',
        },
        LastDeliveryOrRenewTime: '2019-10-01T15:30:58-07:00',
        HasAttachmentPreviews: false,
        LastSender: {
            Mailbox: {
                Name: 'Sayali Shah',
                EmailAddress: 'sayalis@microsoft.com',
                RoutingType: 'SMTP',
            },
        },
    };
}
