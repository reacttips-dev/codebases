import { startSearch } from 'owa-search-actions';
import type { ActionSource } from 'owa-analytics-types';
import { mutator } from 'satcheljs';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { getGuid } from 'owa-guid';

export default mutator(startSearch, actionMessage => {
    const { scenarioId, actionSource } = actionMessage;
    const store = getScenarioStore(scenarioId);

    /**
     * We should investigate if it's possible to move all ID assignments here instead of just
     * for mail module.
     *
     * Work Item 94468: Investigate if search ID assignment can happen in startSearchMutator in owa-search package
     */
    if (scenarioId === SearchScenarioId.Mail) {
        store.currentSearchQueryId = store.nextSearchQueryId;
        store.nextSearchQueryId = getGuid();
        store.answerPlaceholderId = getGuid();
        store.isAnswerRendered = false;
        store.tableViewId = null;
    }

    // Set source of search
    store.queryActionSource = actionSource as ActionSource;

    // Clear query alteration type from previous search
    store.queryAlterationType = null;
});
