import conversationCache from 'owa-mail-store/lib/store/conversationCache';
import type ConversationItemParts from 'owa-mail-store/lib/store/schema/ConversationItemParts';
import type { MruCache } from 'owa-mru-cache';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import type { ObservableMap } from 'mobx';
import type Item from 'owa-service/lib/contract/Item';
import { mailStore } from 'owa-mail-store';

export interface ShouldPrefetchModelState {
    conversationCache: MruCache<ConversationItemParts>;
    items: ObservableMap<string, Item>;
}

/**
 * Determines whether to prefetch a model. We will prefetch an row only if its in the currently loaded rows in UI
 * @param - id - Id of the row to be prefetched
 * @param - updateOnlyIfModelExistsInCache - Flag indicating to update the row only if it is in the cache to get latest information on it
 * @param - ShouldPrefetchModelState for unit testing
 * @returns true if we should prefetch the model, false otherwise
 */
export default function shouldPrefetchModel(
    id: string,
    listViewType: ReactListViewType,
    updateOnlyIfModelExistsInCache: boolean,
    state: ShouldPrefetchModelState = {
        conversationCache: conversationCache,
        items: mailStore.items,
    }
): boolean {
    let modelInCache;
    if (listViewType === ReactListViewType.Conversation) {
        modelInCache = state.conversationCache.get(id);
    } else if (listViewType === ReactListViewType.Message) {
        const item = state.items.get(id);
        modelInCache = item?.NormalizedBody;
    }
    // When updateOnlyIfModelExistsInCache is true, consumer cares if it exists in the cache and
    // wants to prefetch it only if it is in the cache
    if (updateOnlyIfModelExistsInCache) {
        return modelInCache != null;
    } else {
        // If updateOnlyIfModelExistsInCache is false,
        // consumer wants to only prefetch and not worried about the latest data.
        // In this case we prefetch only if the model does not exists in cache
        return modelInCache == null;
    }
}
