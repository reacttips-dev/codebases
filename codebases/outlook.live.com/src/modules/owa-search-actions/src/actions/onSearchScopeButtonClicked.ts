import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';
import { addDatapointConfig } from 'owa-analytics-actions';

export const onSearchScopeButtonClicked = action(
    'onSearchScopeButtonClicked',
    (isScopeVisible: boolean, searchScenarioType: SearchScenarioId) =>
        addDatapointConfig(
            {
                name: 'Search_ScopeButtonClicked',
                customData: {
                    isFolderScopeVisible: isScopeVisible,
                    searchScenarioType: searchScenarioType,
                },
            },
            {
                isScopeVisible,
                searchScenarioType,
            }
        )
);
