import { isFeatureEnabled } from 'owa-feature-flags';
import getLastestNonDraftItemId from 'owa-mail-reading-pane-store/lib/utils/getLastestNonDraftItemId';
import selectMailStoreItemById from 'owa-mail-store/lib/selectors/selectMailStoreItemById';
import isConversationInMailStore from 'owa-mail-store/lib/utils/isConversationInMailStore';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import type Item from 'owa-service/lib/contract/Item';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';

// This logic is used by most, if not all, pill features.
// The basic idea is that if we're in conversation view, we only show pills on the last item part.
// If in message view, we only show pills when mc-smartPillsMessageView is enabled.
export default function shouldMakeGetItemCall(
    itemId: string,
    listviewType: ReactListViewType
): boolean {
    const item: Item = selectMailStoreItemById(itemId);

    if (item) {
        if (listviewType === ReactListViewType.Message || shouldShowUnstackedReadingPane()) {
            return (
                isFeatureEnabled('mc-smartPillsMessageView') ||
                isFeatureEnabled('mc-smartPillsMessageViewOnTop')
            );
        } else if (listviewType === ReactListViewType.Conversation) {
            // In conversation view, only fetch for the last non-draft item.
            if (isConversationInMailStore(item.ConversationId?.Id)) {
                const lastestNonDraftItemId: string = getLastestNonDraftItemId(
                    item.ConversationId.Id
                );
                return lastestNonDraftItemId === itemId;
            }
        }
    }

    return false;
}
