import type { SearchProvider } from 'owa-search-service';
import type { SearchScenarioId } from 'owa-search-store';
import type ConnectedAccountInfo from 'owa-search-service/lib/data/schema/ConnectedAccountInfo';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import { action } from 'satcheljs';

/**
 * Action dispatched when a search should occur.
 *
 * @param actionSource The source that initiated the search.
 * @param explicitSearch True if from "Enter" on the search box or from search button click; false otherwise.
 */
export const startSearch = action(
    'START_SEARCH',
    (
        actionSource: string | null,
        scenarioId: SearchScenarioId,
        explicitSearch: boolean = false,
        connectedAccountInfo: ConnectedAccountInfo[] = [],
        searchProvider?: SearchProvider,
        filter: ViewFilter = 'All'
    ) => {
        return {
            actionSource,
            scenarioId,
            explicitSearch,
            connectedAccountInfo,
            searchProvider,
            filter,
        };
    }
);
