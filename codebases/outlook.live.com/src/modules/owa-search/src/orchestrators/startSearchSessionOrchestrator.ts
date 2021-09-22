import importLazyImports from '../utils/importLazyImports';
import setNextSearchQueryId from '../mutators/setNextSearchQueryId';
import setSearchSessionGuid from '../mutators/setSearchSessionGuid';
import { getGuid } from 'owa-guid';
import { lazySubstrateSearchInitOperation } from 'owa-search-service/lib/lazyFunctions';
import { orchestrator } from 'satcheljs';
import { startSearchSession, searchSessionStarted } from 'owa-search-actions';
import getSubstrateSearchScenarioBySearchScenarioId from '../utils/getSubstrateSearchScenarioBySearchScenarioId';
import getXClientFlightsHeaderValue from '../utils/getXClientFlightsHeaderValue';
import { logUsage } from 'owa-analytics';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';

export default orchestrator(startSearchSession, actionMessage => {
    const { actionSource, shouldStartSearch, scenarioId } = actionMessage;
    const store = getScenarioStore(scenarioId);

    // Throw if user is already in a search session.
    if (store.searchSessionGuid) {
        throw new Error('searchSessionGuid should not be set when starting a search session.');
    }

    // Set IDs in the store.
    const searchSessionId = getGuid();
    setSearchSessionGuid(searchSessionId, scenarioId);
    setNextSearchQueryId(getGuid(), scenarioId);

    // Make init request if search box is 3S-powered.
    // In Mail defer to the startSearchSession handler in owa-mail-search and do module specific
    // work to determine which version of the 3S api to call
    if (store.isUsing3S && scenarioId !== SearchScenarioId.Mail) {
        lazySubstrateSearchInitOperation.import().then(substrateSearchInitOperation => {
            substrateSearchInitOperation(
                store.nextSearchQueryId,
                getSubstrateSearchScenarioBySearchScenarioId(scenarioId),
                getXClientFlightsHeaderValue(scenarioId),
                1 /* 3S API Version */
            );
        });
    }

    /**
     * After common "start session" work is done, dispatch event to notify
     * consumer that search session has been started.
     */
    searchSessionStarted(actionSource, shouldStartSearch, scenarioId);

    /**
     * Since search session has started, we can kick off imports for other
     * actions, mutators, and orchestrators required for search to speed up
     * user experience.
     */
    importLazyImports();

    logUsage('Search_SessionStarted', [SearchScenarioId[scenarioId], actionSource]);
});
