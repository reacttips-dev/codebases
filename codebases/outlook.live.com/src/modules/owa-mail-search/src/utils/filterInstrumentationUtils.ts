import setFiltersInstrumentationContext from '../mutators/setFiltersInstrumentationContext';
import { getStore } from '../store/store';
import { getGuid } from 'owa-guid';
import { SubstrateSearchScenario } from 'owa-search-service';
import { getScenarioStore, SearchScenarioId } from 'owa-search-store';
import {
    FiltersInstrumentationContext,
    SearchFilterItemInstrumentationContext,
} from '../store/schema/FiltersInstrumentationContext';
import {
    lazyLogResponseReceivedV2,
    lazyLogClientDataSource,
    ClientDataSourceEvent,
    Results,
    ResultsView,
    lazyLogSearchEntityActions,
    lazyLogSearchActions,
} from 'owa-search-instrumentation';

export function logInitialFiltersInstrumentation(items: SearchFilterItemInstrumentationContext[]) {
    const filtersInstrumentationContext = createFilterInstrumentationContext(items);
    const { currentSearchQueryId } = getScenarioStore(SearchScenarioId.Mail);

    lazyLogResponseReceivedV2.import().then(logResponseReceived => {
        logResponseReceived(
            SubstrateSearchScenario.Mail,
            filtersInstrumentationContext.ProviderId,
            0,
            200,
            'LocalFilterProvider'
        );
    });

    const clientDataSourceEvent: ClientDataSourceEvent = {
        traceId: filtersInstrumentationContext.ProviderId,
        userId: null,
        tenantId: null,
        conversationId: currentSearchQueryId,
        logicalId: currentSearchQueryId,
        providerName: 'LocalFilterProvider',
        results: filtersInstrumentationContext.ClientDataSource,
        impressionType: 'Query',
    };

    lazyLogClientDataSource.importAndExecute(SubstrateSearchScenario.Mail, clientDataSourceEvent);

    setFiltersInstrumentationContext(filtersInstrumentationContext);
}

export function createFilterInstrumentationContext(
    items: SearchFilterItemInstrumentationContext[]
): FiltersInstrumentationContext {
    const providerId = getGuid();

    const clientDataSource: Results[] = [];
    const clientLayout: ResultsView[] = [];

    for (const item of items) {
        if (item) {
            if (item.subMenuItems && item.subMenuItems.length > 0) {
                const clientLayoutGroupResult: ResultsView = {
                    name: item.name,
                    position: clientLayout.length + 1,
                    type: 'Group',
                    layoutType: 'Vertical',
                    placementType: 'Visible',
                };

                const clientLayoutGroupResults: ResultsView[] = [];
                for (const subItem of item.subMenuItems) {
                    clientDataSource.push({
                        referenceId: subItem.referenceId,
                        type: 'Filter',
                        subType: subItem.name,
                    });

                    const clientLayoutResult: ResultsView = {
                        position: clientLayoutGroupResults.length + 1,
                        type: 'Entity',
                        entityType: 'Filter',
                        referenceId: subItem.referenceId,
                        providerId: providerId,
                        placementType: 'Visible',
                        entityAttributes: {
                            IsSelected: subItem.selected,
                        },
                    };
                    clientLayoutGroupResults.push(clientLayoutResult);
                }

                clientLayoutGroupResult.resultsView = clientLayoutGroupResults;
                clientLayout.push(clientLayoutGroupResult);
            } else {
                clientDataSource.push({
                    referenceId: item.referenceId,
                    type: 'Filter',
                    subType: item.name,
                });

                const clientLayoutResult: ResultsView = {
                    name: 'Filter',
                    position: clientLayout.length + 1,
                    type: 'Entity',
                    entityType: 'Filter',
                    referenceId: item.referenceId,
                    providerId: providerId,
                    placementType: 'Visible',
                    entityAttributes: { IsSelected: item.selected },
                };
                clientLayout.push(clientLayoutResult);
            }
        }
    }

    return {
        ProviderId: providerId,
        ClientDataSource: clientDataSource,
        ClientLayout: clientLayout,
    };
}

export function logFilterClientEvent(filterName: string, selected: boolean): void {
    const { filtersInstrumentationContext } = getStore();
    const { currentSearchQueryId } = getScenarioStore(SearchScenarioId.Mail);
    const matchingFilter = filtersInstrumentationContext.ClientDataSource.filter(
        filter => filter.subType == filterName
    );
    let refId = '';
    if (matchingFilter?.length > 0) {
        refId = matchingFilter[0].referenceId;
    }

    lazyLogSearchEntityActions.importAndExecute(
        SubstrateSearchScenario.Mail,
        null /* userId */,
        null /* tenantId */,
        currentSearchQueryId /* logicalId */,
        filtersInstrumentationContext.ProviderId /* traceId */,
        refId,
        'EntityClicked',
        new Map<string, string>([['EntityClickDetails', selected ? 'Select' : 'Deselect']])
    );
}

export function logFilterPaneClicked(): void {
    const { filtersInstrumentationContext } = getStore();

    lazyLogSearchActions.importAndExecute(
        SubstrateSearchScenario.Mail,
        null /* userId */,
        null /* tenantId */,
        filtersInstrumentationContext.ProviderId,
        null /* traceId */,
        'FilterPaneClicked',
        new Map<string, string>([['FilterTypes', 'Time']])
    );
}
