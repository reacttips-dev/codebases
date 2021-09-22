import type ConversationReadingPaneViewState from 'owa-mail-reading-pane-store/lib/store/schema/ConversationReadingPaneViewState';
import {
    getSelectedTableView,
    getRowKeysFromRowIds,
    MailRowDataPropertyGetter,
} from 'owa-mail-list-store';

export default function getUnreadMessageCount(viewState: ConversationReadingPaneViewState): number {
    const tableView = getSelectedTableView();
    const rowKeys = getRowKeysFromRowIds([viewState.conversationId.Id], tableView);

    if (rowKeys.length === 1) {
        return MailRowDataPropertyGetter.getUnreadCount(rowKeys[0], tableView);
    }

    return 0;
}
