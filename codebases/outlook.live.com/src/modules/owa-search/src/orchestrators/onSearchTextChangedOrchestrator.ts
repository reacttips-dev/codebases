import { orchestrator } from 'satcheljs';
import { onSearchTextChanged, setSearchText } from 'owa-search-actions';

export default orchestrator(onSearchTextChanged, actionMessage => {
    const { scenarioId, searchText } = actionMessage;

    // Always set the search text in response to search box text changing.
    setSearchText(searchText, scenarioId);
});
