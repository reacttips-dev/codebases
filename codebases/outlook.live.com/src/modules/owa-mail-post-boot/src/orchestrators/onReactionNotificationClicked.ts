import type { ClientItemId } from 'owa-client-ids';
import { onReactionNotificationClicked } from 'owa-header-app-notifications';
import { getSelectedTableView, isConversationView } from 'owa-mail-list-store';
import { getCurrentTableMailboxInfo } from 'owa-mail-mailboxinfo';
import { lazyMoveReadingPaneToTab } from 'owa-mail-reading-pane-store';
import { getStore as getMailStore } from 'owa-mail-store';
import { lazyLoadConversation, lazyLoadItem } from 'owa-mail-store-actions';
import { orchestrator } from 'satcheljs';

export default orchestrator(onReactionNotificationClicked, async message => {
    const notification = message.notification;
    if (isConversationView(getSelectedTableView())) {
        const cachedConversation = getMailStore().conversations.get(notification.conversationId);
        const conversationId: ClientItemId = {
            Id: notification.conversationId,
            mailboxInfo: getCurrentTableMailboxInfo(),
        };
        if (!cachedConversation) {
            // make a get convesation item call if the data is not already available in cache
            await lazyLoadConversation.importAndExecute(conversationId, 'LoadReactedConversation');
        }

        openItemInNewTab(conversationId, notification.subject);
    } else {
        const cachedItem = getMailStore().items.get(notification.itemId);
        const itemId: ClientItemId = {
            Id: notification.itemId,
            mailboxInfo: getCurrentTableMailboxInfo(),
        };

        if (cachedItem?.NormalizedBody) {
            openItemInNewTab(itemId, notification.subject);
        } else {
            const itemId: ClientItemId = {
                Id: notification.itemId,
                mailboxInfo: getCurrentTableMailboxInfo(),
            };
            await lazyLoadItem.importAndExecute(itemId, 'LoadReactedItem');
            openItemInNewTab(itemId, notification.subject);
        }
    }
});

function openItemInNewTab(rowId: ClientItemId, rowSubject: string) {
    // Open the RowId (Conversation or Item) on the reading pane
    lazyMoveReadingPaneToTab.importAndExecute(
        rowId,
        rowSubject,
        [] /* categories */,
        true /* makeActive */,
        null /* instrumentation context */
    );
}

export type { ReactionNotificationData } from 'owa-header-app-notifications';
