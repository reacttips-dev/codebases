import { action } from 'satcheljs/lib/legacy';
import markReadStore from '../store/Store';
import type MarkReadStore from '../store/schema/MarkReadStore';

export interface SuppressedItemIdsMapOperationsState {
    store: MarkReadStore;
}

/**
 * Add each item id in the given list to the suppressed item ids dictionary
 * @param itemIds the itemIds to be added to the suppressed dictionary
 * @param state which contains the markReadStore
 */
export let add = action('AddMarkReadSuppressedItemIds')(function add(
    itemIds: string[],
    state: SuppressedItemIdsMapOperationsState = { store: markReadStore }
) {
    itemIds.forEach(id => (state.store.suppressedItemIdsMap[id] = true));
});

/**
 * Clear each item id by removing it from the suppressed item ids dictionary
 * @param itemId the item id to be removed from the suppressed dictionary
 * @param state which contains the markReadStore
 */
export let remove = action('RemoveMarkReadSuppressedItemIds')(function remove(
    itemIds: string[],
    state: SuppressedItemIdsMapOperationsState = { store: markReadStore }
) {
    itemIds.forEach(id => delete state.store.suppressedItemIdsMap[id]);
});

/**
 * Clear the suppressed state
 * @param state which contains the markReadStore
 */
export let clear = action('ClearMarkReadSuppressedMap')(function clear(
    state: SuppressedItemIdsMapOperationsState = { store: markReadStore }
) {
    state.store.suppressedItemIdsMap = {};
});

/**
 * Whether there is any items to be suppressed
 * @return true if the suppressed map is empty
 */
export function isEmpty(): boolean {
    return Object.keys(markReadStore.suppressedItemIdsMap).length == 0;
}

/**
 * Whether specified itemIds is a subset of itemIds in suppressedItemIdsMap
 * @param itemIds the given itemIds
 * @return true if specified itemIds is a subset of itemIds in suppressedItemIdsMap, false otherwise
 */
export function contains(itemIds: string[]): boolean {
    for (let i = 0; i < itemIds.length; i++) {
        if (!markReadStore.suppressedItemIdsMap[itemIds[i]]) {
            return false;
        }
    }

    return true;
}
