import { suggestionSelected } from 'owa-search-actions';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { logUsage } from 'owa-analytics';
import { getAggregationBucket } from 'owa-analytics-actions';
import { SuggestionKind } from 'owa-search-service/lib/data/schema/SuggestionSet';
import { orchestrator } from 'satcheljs';

export default orchestrator(suggestionSelected, actionMessage => {
    const { suggestion, actionSource, scenarioId, index } = actionMessage;

    logUsage('Search_SuggestionSelected', [
        SearchScenarioId[scenarioId],
        SuggestionKind[suggestion.kind],
        index,
        actionSource,
        getAggregationBucket({
            value: getScenarioStore(scenarioId).searchTextForSuggestion.length,
        }),
    ]);
});
