import type ConversationReadingPaneViewState from './schema/ConversationReadingPaneViewState';
import type ItemReadingPaneViewState from './schema/ItemReadingPaneViewState';
import type ReadingPaneStore from './schema/ReadingPaneStore';
import { ObservableMap } from 'mobx';
import conversationCache from 'owa-mail-store/lib/store/conversationCache';
import { createStore } from 'satcheljs';

const initialReadingPaneStore: ReadingPaneStore = {
    loadedItemReadingPaneViewStates: new ObservableMap<string, ItemReadingPaneViewState>({}),
    loadedConversationReadingPaneViewStates: new ObservableMap<
        string,
        ConversationReadingPaneViewState
    >({}),
    itemPreviewPaneViewState: null,
    itemPrintPaneViewState: null,
    deeplinkId: null,
    shouldShowMobileUpsellEmptyState: false,
    primaryReadingPaneTabId: null,
    sxsItemId: null, // used for conversation reading pane
};

export let getStore = createStore<ReadingPaneStore>('readingpane', initialReadingPaneStore);
const store = getStore();

// Register the reading pane conversation with the conversation cache
conversationCache.registerReference(() => [
    ...store.loadedConversationReadingPaneViewStates.keys(),
]);

export default store;
