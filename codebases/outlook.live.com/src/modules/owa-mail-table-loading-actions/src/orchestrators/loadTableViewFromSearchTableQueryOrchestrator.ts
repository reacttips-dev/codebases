import loadTableViewFromTableQuery from '../actions/loadTableViewFromTableQuery';
import { onMailSearchComplete } from 'owa-mail-actions/lib/mailSearchActions';
import {
    loadTableViewFromSearchTableQuery,
    LoadTableViewFromSearchTableQueryActionMessage,
} from 'owa-mail-search/lib/actions/publicActions';
import { orchestrator } from 'satcheljs';
import type { SearchTableQuery } from 'owa-mail-list-search';

orchestrator(
    loadTableViewFromSearchTableQuery,
    async (actionMessage: LoadTableViewFromSearchTableQueryActionMessage) => {
        const {
            searchTableQuery,
            searchEndToEndPerformanceDatapoint,
            actionSource,
        } = actionMessage;

        // Load table view from search table query (makes search requests in here).
        await loadTableViewFromTableQuery(
            searchTableQuery,
            searchEndToEndPerformanceDatapoint,
            actionSource
        );

        // End SearchEndToEnd datapoint since search results are now loaded.
        searchEndToEndPerformanceDatapoint.end();

        // Once table view has loaded, dispatch action to notify search completed.
        onMailSearchComplete(searchTableQuery as SearchTableQuery);
    }
);
