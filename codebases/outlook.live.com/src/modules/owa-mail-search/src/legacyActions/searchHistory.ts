import searchStore from '../store/store';
import {
    getUserConfiguration,
    updateUserConfiguration,
    lazyUpdateUserConfigurationService,
} from 'owa-session-store';
import { mutatorAction } from 'satcheljs';

const MAX_HISTORY_ENTRIES: number = 100;

/**
 * Add to the local search history user config.
 * @param searchQuery
 */
export function addToLocalSearchHistory(searchQuery: string) {
    updateUserConfiguration(config => {
        const viewStateConfiguration = config.ViewStateConfiguration;

        // Search history will be null for mailboxes which have not performed any searches.
        if (!viewStateConfiguration.SearchHistory) {
            // Set the local searchHistory in user config to empty array.
            viewStateConfiguration.SearchHistory = [];
        }

        if (viewStateConfiguration.SearchHistory.length > 0) {
            // Check if search history already has an entry for this query.
            const searchQueryLower = searchQuery.toLocaleLowerCase().trim();
            let foundIndex = -1;

            for (let i = 0; i < viewStateConfiguration.SearchHistory.length; i++) {
                const searchHistoryValue = viewStateConfiguration.SearchHistory[i].trim();
                if (searchHistoryValue.toLocaleLowerCase() == searchQueryLower) {
                    foundIndex = i;
                    break;
                }
            }

            // Remove the duplicate entry if we found any.
            if (foundIndex > -1) {
                viewStateConfiguration.SearchHistory.splice(foundIndex, 1);
            }
        }

        // Add the searchQuery at the beginning of the search history.
        viewStateConfiguration.SearchHistory.unshift(searchQuery);
        viewStateConfiguration.SearchHistory.splice(MAX_HISTORY_ENTRIES);
    });

    // Set isSearchHistoryDirty flag to true, now that we have updated it.
    setSearchHistoryIsDirty();
}

const setSearchHistoryIsDirty = mutatorAction('setSearchHistoryIsDirty', () => {
    searchStore.isSearchHistoryDirty = true;
});

/**
 * Updates search history in the user configuration.
 */
export function updateSearchHistoryUserConfig(): void {
    const searchHistory = getUserConfiguration().ViewStateConfiguration.SearchHistory;

    lazyUpdateUserConfigurationService.importAndExecute(
        [
            {
                key: 'SearchHistory',
                valuetype: 'StringArray',
                value: searchHistory as string[],
            },
        ],
        'OWA.ViewStateConfiguration'
    );
}
