import { getInstrumentationContext } from 'owa-mail-list-store/lib/selectors/mailRowDataPropertyGetter';
import { getStore as getMailSearchStore } from 'owa-mail-search';
import { getScenarioStore, SearchScenarioId } from 'owa-search-store';
import type { ResultsView } from 'owa-search-instrumentation';
import type { TableView } from 'owa-mail-list-store';

export const getResultsView = (tableView: TableView) => {
    const resultsView: ResultsView[] = [];
    let offset = 1;

    const { filtersInstrumentationContext } = getMailSearchStore();

    if (filtersInstrumentationContext) {
        const filterInstResultsView: ResultsView = {
            type: 'Group',
            name: 'FilterBar',
            position: 1,
            layoutType: 'Horizontal',
            resultsView: filtersInstrumentationContext.ClientLayout,
        };
        resultsView.push(filterInstResultsView);
        offset++;
    }

    // get Speller inst info
    const searchStore = getScenarioStore(SearchScenarioId.Mail);
    if (searchStore.alteredQuery) {
        const spellerResultsView: ResultsView = {
            type: 'Group',
            name: 'QueryAlterationSuggestion',
            position: offset,
            layoutType: 'Vertical',
            resultsView: [
                {
                    name: 'Suggestion',
                    position: 1,
                    type: 'Entity',
                    entityType: searchStore.queryAlterationType,
                    referenceId: searchStore.suggestedSearchTermReferenceId,
                    providerId: searchStore.alterationProviderId,
                    placementType: 'Visible',
                },
            ],
        };

        resultsView.push(spellerResultsView);
        offset++;
    }

    if (searchStore.isAnswerRendered) {
        const answerBlockView: ResultsView = {
            type: 'Entity',
            entityType: 'AnswerBlock',
            position: offset,
            placementType: 'Visible',
            placeHolderId: searchStore.answerPlaceholderId,
            referenceId: '00000000-0000-0000-0000-000000000000',
            providerId: '00000000-0000-0000-0000-000000000000',
        };

        resultsView.push(answerBlockView);
        offset++;
    }

    const mailEntityResults = [];
    tableView?.rowKeys.forEach(rowKey => {
        const instrumentationContext = getInstrumentationContext(rowKey, tableView);

        mailEntityResults.push({
            type: 'Entity',
            name: 'Mail',
            referenceId: instrumentationContext.referenceKey,
            providerId: instrumentationContext.traceId,
            position: instrumentationContext.index + 1,
            entityType: 'Email',
            placementType: 'Visible',
        });
    });

    if (mailEntityResults.length > 0) {
        resultsView.push({
            type: 'Group',
            name: 'Message',
            position: offset,
            layoutType: 'Vertical',
            resultsView: mailEntityResults,
        });
    }

    return resultsView;
};
