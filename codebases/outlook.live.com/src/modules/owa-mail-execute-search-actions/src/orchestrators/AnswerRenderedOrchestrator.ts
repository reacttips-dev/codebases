import { orchestrator } from 'satcheljs';
import { onAnswerRendered } from 'owa-mail-search';
import { setIsAnswerRendered } from '../actions/internalActions';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { lazyLogClientLayout } from 'owa-search-instrumentation';
import { listViewStore } from 'owa-mail-list-store';
import { SubstrateSearchScenario } from 'owa-search-service';
import { getResultsView } from '../helpers/getResultView';
import { logUsage } from 'owa-analytics';

export default orchestrator(onAnswerRendered, actionMessage => {
    setIsAnswerRendered(true);
    logClientLayoutForAnswerBlock();
    logUsage('Search_Answers_AnswerRendered');
});

function logClientLayoutForAnswerBlock(): void {
    const { currentSearchQueryId, tableViewId } = getScenarioStore(SearchScenarioId.Mail);
    const tableView = listViewStore.tableViews.get(tableViewId);
    const resultsView = getResultsView(tableView);
    lazyLogClientLayout.importAndExecute(
        SubstrateSearchScenario.Mail,
        null /* Puid */,
        null /* TenantId */,
        currentSearchQueryId,
        currentSearchQueryId,
        'Vertical',
        resultsView
    );
}
