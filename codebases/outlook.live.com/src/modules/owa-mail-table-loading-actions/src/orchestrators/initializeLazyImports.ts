import { lazyLoadSearchTable } from 'owa-mail-execute-search-actions';
import { searchSessionStarted } from 'owa-search-actions/lib/actions/searchSessionStarted';
import { orchestrator } from 'satcheljs';

orchestrator(searchSessionStarted, () => {
    /**
     * Pre-import lazy search operations needed for making requests for search
     * results, because if we do not, the first import will go through a promise
     * resolve, delaying the search request from going out, even if the script
     * file is loaded in the DOM.
     */
    lazyLoadSearchTable.import();
});
