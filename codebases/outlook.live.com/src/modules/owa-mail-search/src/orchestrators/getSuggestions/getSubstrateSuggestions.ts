import convertSubstrateSuggestionsResponseToSuggestionSet from './convertSubstrateSuggestionsResponseToSuggestionSet';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import getSuggestionQueryString from '../../selectors/getSuggestionQueryString';
import { GenericKeys } from 'owa-analytics/lib/types/DatapointEnums';
import { getStore as getMailSearchStore } from '../../store/store';
import { isFeatureEnabled } from 'owa-feature-flags';
import { PerformanceDatapoint } from 'owa-analytics';
import {
    is3SServiceAvailable,
    getXClientFlightsHeaderValue,
    isModernFilesEnabled,
} from 'owa-search';
import { setLatestTraceId } from 'owa-search-actions';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import {
    getLocalTime,
    substrateSearchSuggestionsService,
    SubstrateSearchSuggestionsResponse,
    SearchScope,
    SearchScopeKind,
    SuggestionSet,
    SubstrateSearchScenario,
} from 'owa-search-service';
import { lazyLogResponseReceivedV2 } from 'owa-search-instrumentation';
import { AccessIssue, getCombinedAccessIssue } from 'owa-attachment-policy-access-issue-checker';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

/**
 * Gets suggestions from 3S.
 */
export default async function getSubstrateSuggestions(
    scenarioId: SearchScenarioId
): Promise<SuggestionSet> {
    const searchStore = getScenarioStore(scenarioId);

    const suggestionsRequestTime = new Date();

    const customHeaders = {
        'client-session-id': searchStore.searchSessionGuid,
        'x-client-localtime': getLocalTime(),
        'client-request-id': searchStore.latestQFRequestId,
        'X-Client-Flights': getXClientFlightsHeaderValue(scenarioId),
    };

    // Add "x-user-context" header if we can create the user context.
    const userContext = getUserScopeContext(getMailSearchStore().staticSearchScope);
    if (userContext) {
        customHeaders['x-user-context'] = userContext;
    }

    // Start datapoint to track suggestions request latency.
    const networkPerformanceDatapoint = new PerformanceDatapoint('TnS_Autosuggestion3S');

    // Get 3S scenario ID based on search box scenario ID.
    const substrateSearchScenario =
        scenarioId === SearchScenarioId.Mail
            ? SubstrateSearchScenario.Mail
            : SubstrateSearchScenario.FilesHub;

    const queryString = getSuggestionQueryString(scenarioId);
    const substrateSuggestionsResponse = await substrateSearchSuggestionsService(
        queryString,
        searchStore.searchSessionGuid,
        searchStore.nextSearchQueryId,
        getSupportedEntityTypes(queryString),
        substrateSearchScenario,
        customHeaders,
        scenarioId == SearchScenarioId.Mail
            ? searchStore.latestQFRequestId
            : undefined /* LogicalId */,
        isModernFilesEnabled() ? 'odspFilesForOwa' : undefined
    );

    // End datapoint to track suggestions request latency.
    networkPerformanceDatapoint.end();

    const emptySuggestionSet = {
        Suggestions: [],
        TraceId: searchStore.latestQFRequestId,
        IsComplete: true,
        RequestStart: suggestionsRequestTime,
    };

    /**
     * If we don't get a valid response, return empty suggestion set. We
     * defensively check for a falsey object, but also check if the response
     * is an array (as that's what the makeServiceRequest function returns when
     * there's a fetch error).
     */
    if (!substrateSuggestionsResponse || Array.isArray(substrateSuggestionsResponse)) {
        return emptySuggestionSet;
    }

    lazyLogResponseReceivedV2.importAndExecute(
        SubstrateSearchScenario.Mail,
        substrateSuggestionsResponse.headers.get('request-id'),
        <number>networkPerformanceDatapoint.getData(GenericKeys.e2eTimeElapsed),
        substrateSuggestionsResponse.status
    );

    try {
        const substrateSuggestionsResponseBody = <SubstrateSearchSuggestionsResponse>(
            await substrateSuggestionsResponse.json()
        );

        // Dispatch action to update latestTraceId in the store.
        setLatestTraceId(
            substrateSuggestionsResponseBody.Instrumentation.TraceId,
            scenarioId,
            true /* isQFTraceId */
        );

        // Parse response into SuggestionSet.
        const suggestionSet = substrateSuggestionsResponseBody.Groups
            ? convertSubstrateSuggestionsResponseToSuggestionSet(
                  substrateSuggestionsResponseBody,
                  queryString
              )
            : {
                  Suggestions: [],
                  TraceId: substrateSuggestionsResponseBody.Instrumentation.TraceId,
                  IsComplete: true,
                  RequestStart: suggestionsRequestTime,
              };

        /**
         * Check suggestionsRequestTime against displayedQfRequestTime,
         * and if newer, than return.
         *
         * If not, log "responseneverrendered" event and return whatever is currently
         * in the store (since those suggestions are newer).
         */
        const displayedQFRequestTime = searchStore.displayedQFRequestTime;
        if (
            !displayedQFRequestTime ||
            suggestionsRequestTime.getTime() > displayedQFRequestTime.getTime()
        ) {
            suggestionSet.RequestStart = suggestionsRequestTime;
            return suggestionSet;
        } else {
            // Return most recent, valid suggestions (if any exist).
            return searchStore.currentSuggestions || emptySuggestionSet;
        }
    } catch (e) {
        /**
         * In some cases (i.e. 401 from server) we will not have a body so return
         * empty suggestion set
         */
        return emptySuggestionSet;
    }
}

function getSupportedEntityTypes(queryString: string) {
    const supportedEntityTypes: string[] = ['Text', 'People', 'Message'];
    if (is3SServiceAvailable()) {
        if (queryString && queryString.length > 0) {
            // Determine the user's allowed access to mail attachments
            const accessLevel = getCombinedAccessIssue();
            if (isModernFilesEnabled()) {
                // 'File' type will encompass both Cloudy + regular attachments when used in QF
                supportedEntityTypes.push('File');
            } else if (accessLevel !== AccessIssue.ReadOnlyPlusAttachmentsBlocked) {
                // User is allowed to at least "preview" attachments, so we
                // can still show them relevant suggestions
                supportedEntityTypes.push('Attachment');
            }
            if (isFeatureEnabled('sea-calendarSuggestions')) {
                supportedEntityTypes.push('Event');
            }
        }
        // Zero Query Scenario
        else {
            if (isFeatureEnabled('sea-files-mru') && !isConsumer()) {
                supportedEntityTypes.push('File');
            }
        }
    }

    return supportedEntityTypes.join(',');
}

/**
 * This function is used to get the value for the "x-user-context" header,
 * which is used by 3S to send back the appropriate KQL for people suggestions.
 */
function getUserScopeContext(staticSearchScope: SearchScope) {
    if (staticSearchScope) {
        switch (staticSearchScope.kind) {
            case SearchScopeKind.PrimaryMailbox:
            case SearchScopeKind.ArchiveMailbox:
                const folderId = staticSearchScope.folderId;
                const folderName = folderIdToName(folderId);
                return folderName !== 'none'
                    ? `DistinguishedFolderName=${folderName};FolderId=${folderId}`
                    : `FolderId=${folderId}`;
            default:
                return null;
        }
    }

    return null;
}
