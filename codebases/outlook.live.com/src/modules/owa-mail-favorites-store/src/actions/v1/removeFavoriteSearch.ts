import { getStore as getSharedFavoritesStore, updateFavoritesUserOption } from 'owa-favorites';
import type { ActionSource } from 'owa-mail-store';
import { action, orchestrator, mutator } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * Remove a favorite search to the favorite store
 */
const removeFavoriteSearch = action(
    'RemoveFavoriteSearch',
    function removeFavoriteSearch(searchQuery: string, actionSource: ActionSource) {
        // Check if favoriteSearches doesn't contain the search query
        if (!getSharedFavoritesStore().favoriteSearches.has(searchQuery)) {
            throw new Error('Cannot find the search query in favorite search list.');
        }

        return addDatapointConfig(
            {
                name: 'RemoveFavoriteSearch',
                customData: [actionSource, isFeatureEnabled('tri-favorites-roaming')],
            },
            { searchQuery }
        );
    }
);

mutator(removeFavoriteSearch, ({ searchQuery }) => {
    const sharedFavoritesStore = getSharedFavoritesStore();

    // Remove favorite from the store
    sharedFavoritesStore.orderedFavoritesNodeIds.splice(
        sharedFavoritesStore.orderedFavoritesNodeIds.indexOf(searchQuery),
        1
    );
    sharedFavoritesStore.favoriteSearches.delete(searchQuery);
});

orchestrator(removeFavoriteSearch, updateFavoritesUserOption);

export { removeFavoriteSearch as default };
