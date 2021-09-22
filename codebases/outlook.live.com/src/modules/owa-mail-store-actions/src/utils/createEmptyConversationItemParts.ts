import type { ConversationItemParts } from 'owa-mail-store';
import type ConversationSortOrder from 'owa-service/lib/contract/ConversationSortOrder';
import { INITIAL_MAX_ITEMS_TO_RETURN } from '../constants';
import type { ClientItemId } from 'owa-client-ids';

export default function createEmptyConversationItemParts(
    conversationId: ClientItemId,
    conversationSortOrder: ConversationSortOrder
): ConversationItemParts {
    const newConversationItemParts = {
        conversationId: conversationId,
        conversationNodeIds: [],
        conversationSortOrder: conversationSortOrder,
        canLoadMore: false,
        canLoadMoreForRelationMap: false,
        isLoadMoreInProgress: false,
        maxItemsToReturn: INITIAL_MAX_ITEMS_TO_RETURN,
        loadingState: { isLoading: false },
        syncState: '',
        isPendingDelete: false,
        pendingRequestState: null,
        canDelete: null /* Must initialize with null so mobx tracks changes */,
        subjectTranslationData: {
            isShowingTranslation: false,
        },
    };

    return newConversationItemParts;
}
