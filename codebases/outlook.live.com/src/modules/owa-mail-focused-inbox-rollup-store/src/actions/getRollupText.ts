import {
    focusedNewConversationsRollupText,
    otherNewConversationsRollupText,
    focusedNewMessagesRollupText,
    otherNewMessagesRollupText,
} from './getRollupText.locstring.json';
import loc from 'owa-localize';
import InboxViewType from 'owa-service/lib/contract/InboxViewType';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { getListViewTypeForFolder } from 'owa-mail-folder-store';
/**
 * Get rollup text for current folder
 */
export default function getRollupText(viewType: InboxViewType, folderId: string): string {
    let rollupText;
    const listViewType = getListViewTypeForFolder(folderId);

    switch (viewType) {
        case InboxViewType.FocusedView:
            rollupText =
                listViewType == ReactListViewType.Conversation
                    ? loc(focusedNewConversationsRollupText)
                    : loc(focusedNewMessagesRollupText);
            break;
        case InboxViewType.ClutterView:
            rollupText =
                listViewType == ReactListViewType.Conversation
                    ? loc(otherNewConversationsRollupText)
                    : loc(otherNewMessagesRollupText);
            break;
    }

    return rollupText;
}
