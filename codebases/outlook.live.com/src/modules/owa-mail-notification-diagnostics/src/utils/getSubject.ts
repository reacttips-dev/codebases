import type RowNotificationPayload from 'owa-service/lib/contract/RowNotificationPayload';

export default function getSubject(rowNotification: RowNotificationPayload): string {
    let subject: string = '';

    if (rowNotification.Conversation) {
        subject = rowNotification.Conversation.ConversationTopic;
    } else if (rowNotification.Item) {
        subject = rowNotification.Item.Subject;
    }

    return subject;
}
