import { getGuid } from 'owa-guid';
import { is3SServiceAvailable } from 'owa-search';
import {
    lazyLogLocalContentDataSource,
    LocalContentInstrumentationContext,
    LocalContentProvider,
    LocalContentType,
    Suggestion,
    SuggestionKind,
    SubstrateSearchScenario,
} from 'owa-search-service';
import {
    lazyLogClientDataSource,
    ClientDataSourceEvent,
    Results,
    ItemType,
    lazyLogResponseReceivedV2,
} from 'owa-search-instrumentation';

export function logClientSuggestions(
    traceId: string,
    conversationId: string,
    logicalId: string,
    instrumentationContext: {
        [providerName: string]: LocalContentInstrumentationContext[];
    }
) {
    if (is3SServiceAvailable()) {
        Object.keys(instrumentationContext).forEach(providerName => {
            /**
             * The v2 3S instrumentation spec expects different trace IDs
             * for non-3S providers (i.e. category suggestions, search the
             * web suggestion), so instead of using the traceId passed to
             * the function (which is the trace ID of the 3S response), we
             * will generate a GUID to use in its place. This ID is only
             * required for the ResponseReceived and ClientDatasource events,
             * so it's perfectly valid for us to create it, use it for these
             * 2 events, and then continue without storing it somewhere (as
             * it's no longer needed for other instrumentation).
             */
            const clientProviderTraceId = getGuid();

            lazyLogResponseReceivedV2.importAndExecute(
                SubstrateSearchScenario.Mail,
                clientProviderTraceId,
                0 /* latency */,
                200 /* status */
            );

            const resultList = getResultList(instrumentationContext[providerName]);
            const clientDataSourceEvent: ClientDataSourceEvent = {
                traceId: clientProviderTraceId,
                userId: null,
                tenantId: null,
                conversationId: conversationId,
                logicalId: logicalId,
                providerName: providerName,
                results: resultList,
                impressionType: 'Suggestions',
            };

            lazyLogClientDataSource.importAndExecute(
                SubstrateSearchScenario.Mail,
                clientDataSourceEvent
            );
        });

        Object.keys(instrumentationContext).forEach(providerName => {
            lazyLogLocalContentDataSource.importAndExecute(
                traceId,
                providerName as LocalContentProvider,
                instrumentationContext[providerName],
                SubstrateSearchScenario.Mail
            );
        });
    }
}

const getResultList = (instrumentationContext: LocalContentInstrumentationContext[]) => {
    const resultList: Results[] = [];

    instrumentationContext.forEach(context => {
        resultList.push({
            referenceId: context.entityId,
            type: context.contentType as ItemType,
        });
    });
    return resultList;
};

export function createClientSuggestionInstrumentationContext(
    clientSuggestions: Suggestion[],
    type: LocalContentType
): LocalContentInstrumentationContext[] {
    const localContentInstrumentationContexts: LocalContentInstrumentationContext[] = [];

    clientSuggestions.forEach(clientSuggestion => {
        localContentInstrumentationContexts.push({
            localContentId: getGuid(),
            entityId: clientSuggestion.ReferenceId,
            contentType: type,
        });
    });

    return localContentInstrumentationContexts;
}

export function getLocalContentInstrumentationType(
    suggestionKind: SuggestionKind
): LocalContentType {
    switch (suggestionKind) {
        case SuggestionKind.Category:
            return 'category';
        case SuggestionKind.TrySuggestion:
            return 'try';
        case SuggestionKind.Setting:
            return 'setting';
    }

    return 'unknown';
}
