import { clearSearchScope, setStaticSearchScope } from '../actions/publicActions';
import { startSearch } from 'owa-search-actions';
import { SearchScenarioId } from 'owa-search-store';
import getDefaultMailBoxScope from '../utils/getDefaultMailBoxScope';
import { orchestrator } from 'satcheljs';

export default orchestrator(clearSearchScope, actionMessage => {
    // Change scope to "All folders".
    const defaultMailboxScope = getDefaultMailBoxScope(actionMessage.searchScopeKind);
    setStaticSearchScope(defaultMailboxScope);

    // Kick off search (if actionMessage says to).
    if (actionMessage.shouldStartSearch) {
        startSearch(actionMessage.actionSource, SearchScenarioId.Mail, false /* explicitSearch */);
    }
});
