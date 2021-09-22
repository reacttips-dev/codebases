import { onAnswerAvailable, startAnswerSearch } from '../actions/internalActions';
import { startAnswersSearchSession } from '../actions/startAnswersSearchSession';
import getSearchProvider from '../selectors/getSearchProvider';
import getSearchQueryString from '../selectors/getSearchQueryString';
import { getStore as getMailSearchStore } from '../store/store';
import { createSearchClientCallbacks } from '../utils/createSearchClientCallbacks';
import getFolderNameFromScope from '../utils/getFolderNameFromScope';
import getSelectedSearchScope from '../utils/getSelectedSearchScope';
import isAnswerFeatureEnabled from '../utils/isAnswerFeatureEnabled';
import shouldStartSearch from '../utils/shouldStartSearch';
import { logUsage } from 'owa-analytics';
import { createLazyOrchestrator } from 'owa-bundling';
import { getClientId, getClientVersion, getLogicalRing, getCookie } from 'owa-config';
import { getTimeZoneOffset } from 'owa-datetime-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getStore } from 'owa-immersive-reader-store';
import { getCurrentCulture, onLocaleChanged } from 'owa-localize';
import { isSingleLineListView } from 'owa-mail-layout';
import type { ActionSource } from 'owa-mail-store';
import { getAnchorMailbox } from 'owa-ows-gateway/lib/anchormailbox';
import { hasQueryStringParameter } from 'owa-querystring';
import { lazyAddSearchRequestInstrumentation } from 'owa-search-diagnostics';
import { SearchRequestInstrumentation, SearchProvider } from 'owa-search-service';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import sessionStore from 'owa-session-store/lib/store/store';
import isBusiness from 'owa-session-store/lib/utils/isBusiness';
import { getAccessTokenforResourceAsLazy } from 'owa-tokenprovider';
import { getOrigin } from 'owa-url';
import { orchestrator } from 'satcheljs';
import {
    handleAnswersLocalization,
    searchAnswers3SWarmup,
} from '../utils/initializeAndWarmupAnswers';
import { is3SServiceAvailable as getIs3SServiceAvailable } from 'owa-search';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import {
    SearchOptions,
    SearchInitializer,
    AnswerEntityType,
    MicrosoftSearchRequeryParams,
    SubstrateToken,
    IEvent,
    LoggingContext,
} from '@1js/search-hostapp-owa';
import {
    getOptionsForFeature,
    SearchOptions as OwaSearchOptions,
    SearchScope,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';

orchestrator(startAnswerSearch, async actionMessage => {
    const currentSearchQueryId = actionMessage.currentSearchQueryId;
    if (
        !shouldFetchAnswer(
            actionMessage.scenarioId,
            actionMessage.actionSource as ActionSource,
            currentSearchQueryId
        )
    ) {
        return;
    }

    const searchStore = getScenarioStore(SearchScenarioId.Mail);

    // Build query string from search box contents.
    const queryString = getSearchQueryString();

    const pageLoadStartTime = new Date();

    const culture: string = getCurrentCulture();

    if (!getMailSearchStore().isAnswerLocalizationCompleted) {
        await handleAnswersLocalization();
    }
    const buildMsbRequeryUrl = (params: MicrosoftSearchRequeryParams): string => {
        return params.query;
    };

    window['__DEV__'] = false;
    const searchOptions: SearchOptions = {
        clientType: 'Owa',
        clientId: 'Owa.react',
        scenarioName: 'Owa.react',
        culture,
        useSubstrate: true,
        clientCorrelationId: currentSearchQueryId,
        conversationId: currentSearchQueryId,
        logicalSearchId: currentSearchQueryId,
        stringMap: {},
        msbApiEnvironment: 'prod', // should be kept in prod for using bing API's
        buildRequeryUrl: buildMsbRequeryUrl,
        useOdsFeedback: false,
        loggerCallback: event => {
            logAnswerEvents(event);
        },
        initialSearchQuery: {
            query: queryString,
            friendlyQuery: queryString,
        },
        entityTypes: getEntityTypes(),
        clientSize: isSingleLineListView() ? 'Large' : 'Small',
        externalLinkDefaultTarget: '_blank',
        loggingContext: getLoggingContext(searchStore, pageLoadStartTime),
        getRawSubstrateAuthToken: () => getRawSubstrateToken(),
        getSubstrateAuthToken: () => getSubstrateToken(),
        getOdsAuthToken: () => getAuthToken('https://api.diagnostics.office.com'),
        getGraphApiAuthToken: () => getAuthToken('https://graph.microsoft.com'),
        getMsbAuthToken: () => getAuthToken('https://www.bing.com'),
        timeZoneOffsetInMinutes: getTimeZoneOffset(new Date()),
        clientActionCallbacks: createSearchClientCallbacks(),
        xAnchorMailbox: getAnchorMailbox(),
        additionalAnswerConfigs: getAnswersConfig(),
        userProperties: getUserProperties(),
        searchResultHeadingLevel: 3,
        substrateHostName: getOrigin(),
        enablePrivacyCop: isFeatureEnabled('sea-answers-enablePrivacyCop'),
        substrateSearchResponseCallback: onSubstrateAnswersSearchResponseCallback,
        enableAsyncResolution: isFeatureEnabled('sea-calendarAnswer-v2'),
    };

    if (searchOptions.entityTypes.length > 0) {
        const initializer = new SearchInitializer();
        await initializer.start(searchOptions);
    }
});

export const startAnswerSearchSessionOrchestrator = createLazyOrchestrator(
    startAnswersSearchSession,
    'CLONE_START_ANSWER_SEARCH_SESSION',
    actionMessage => {
        const { scenarioId } = actionMessage;
        const store = getScenarioStore(scenarioId);

        if (
            store.isUsing3S &&
            isAnswerFeatureEnabled() &&
            !getUserConfiguration()?.SessionSettings?.IsExplicitLogon &&
            getSearchProvider() !== SearchProvider.SubstrateV2 // if provider is V2, searchSessionStartedOrchestrator will already have called init
        ) {
            searchAnswers3SWarmup(scenarioId);
        }
    }
);

orchestrator(onLocaleChanged, () => {
    handleAnswersLocalization();
});

function isConsoleLoggerEnabled() {
    return process.env.NODE_ENV !== 'production' && hasQueryStringParameter('enableTracing');
}

function getLoggingContext(searchStore: any, pageLoadStartTime: Date): LoggingContext {
    const store = getStore();

    const {
        UserPuid,
        ExternalDirectoryTenantGuid,
        CompanyName,
    } = sessionStore.userConfiguration.SessionSettings;

    return {
        sessionId: store.sessionId,
        muid: getCookie('MUID'),
        hasMsa: !isBusiness(),
        canvas: 'Serp',
        pageLoadStartTime,
        environment: process.env.NODE_ENV !== 'production' ? 'dev' : 'prod',
        serviceGroup: getLogicalRing(),
        placeholderId: searchStore.answerPlaceholderId,
        aadUserId: UserPuid,
        tenantId: ExternalDirectoryTenantGuid,
        tenantName: CompanyName,
        variants: { owa: getAnswerVariants() },
        isConsoleLoggerEnabled: isConsoleLoggerEnabled(),
        is3SEventsLoggingEnabled: isFeatureEnabled('sea-3s-eventsApi'),
    };
}

function getAnswerVariants(): string {
    return `${
        isFeatureEnabled('sea-fetchBookmarks2') || isFeatureEnabled('sea-answers-sdf')
            ? 'fetchBookmarks,'
            : ''
    }${isFeatureEnabled('sea-bookmarkTriggerControl2') ? 'bookmarkTriggerControl,' : ''}${
        isFeatureEnabled('sea-fetchFiles4') ||
        isFeatureEnabled('sea-answers-sdf') ||
        isFeatureEnabled('sea-answers-ms')
            ? 'fetchFiles,'
            : ''
    }${isFeatureEnabled('sea-fileTriggerControl4') ? 'fileTriggerControl,' : ''}${
        isFeatureEnabled('sea-fetchEvents2') ||
        isFeatureEnabled('sea-answers-sdf') ||
        isFeatureEnabled('sea-answers-ms')
            ? 'fetchEvents,'
            : ''
    }${isFeatureEnabled('sea-calendarTriggerControl2') ? 'calendarTriggerControl,' : ''}${
        isFeatureEnabled('sea-fetchLinks2') || isFeatureEnabled('sea-answers-sdf')
            ? 'fetchLinks,'
            : ''
    }${isFeatureEnabled('sea-linkTriggerControl2') ? 'linkTriggerControl,' : ''}${
        isFeatureEnabled('sea-fetchAcronyms3') || isFeatureEnabled('sea-answers-sdf')
            ? 'fetchAcronyms,'
            : ''
    }${isFeatureEnabled('sea-acronymTriggerControl3') ? 'acronymTriggerControl,' : ''}${
        isFeatureEnabled('sea-fetchPeople3') || isFeatureEnabled('sea-answers-sdf')
            ? 'fetchPeople,'
            : ''
    }${isFeatureEnabled('sea-peopleTriggerControl3') ? 'peopleTriggerControl,' : ''}${
        isFeatureEnabled('sea-fetchFlights2') ? 'fetchFlights,' : ''
    }${isFeatureEnabled('sea-flightTriggerControl2') ? 'flightTriggerControl,' : ''}${
        isFeatureEnabled('sea-fileAnswer-v2') ? 'fileAnswerV2,' : ''
    }${isFeatureEnabled('sea-calendarAnswer-v2') ? 'calendarAnswerV2,' : ''}${
        isFeatureEnabled('sea-fileAnswer-v3') ? 'fileAnswerV3,' : ''
    }`;
}

async function getAuthToken(resource: string): Promise<string> {
    let [token, tokenPromise] = getAccessTokenforResourceAsLazy(resource, 'OwaAnswersSearch');

    // If token is not returned synchronously, we need to await on the tokenPromise
    if (!token) {
        token = (await tokenPromise) as string;
    }

    return token as string;
}

async function getSubstrateToken(): Promise<SubstrateToken> {
    const origin = getResourceOrigin();
    const substrateToken = await getAuthToken(origin);

    return { token: substrateToken };
}

// function to use 3S token directly without using await.
// Even though getSubstrateToken does the same but adding an await statement results in a significant delay in sending the request
function getRawSubstrateToken(): string {
    const origin = getResourceOrigin();
    let [token] = getAccessTokenforResourceAsLazy(origin);

    return token as string;
}

export function getResourceOrigin(): string {
    const origin = isBusiness() ? `${getOrigin()}/search` : getOrigin();
    return origin.replace('outlook-sdf.office.com', 'outlook.office.com');
}

function getAnswersConfig() {
    return {
        acronymTriggerControl:
            isFeatureEnabled('sea-acronymTriggerControl3') && !isFeatureEnabled('sea-answers-sdf'),
        bookmarkTriggerControl:
            isFeatureEnabled('sea-bookmarkTriggerControl2') &&
            !isFeatureEnabled('sea-answers-sdf') &&
            !isFeatureEnabled('sea-answers-ms'),
        calendarTriggerControl:
            isFeatureEnabled('sea-calendarTriggerControl2') &&
            !isFeatureEnabled('sea-answers-sdf') &&
            !isFeatureEnabled('sea-answers-ms'),
        fileTriggerControl:
            isFeatureEnabled('sea-fileTriggerControl4') &&
            !isFeatureEnabled('sea-answers-sdf') &&
            !isFeatureEnabled('sea-answers-ms'),
        flightTriggerControl:
            isFeatureEnabled('sea-flightTriggerControl2') &&
            !isFeatureEnabled('sea-answers-sdf') &&
            !isFeatureEnabled('sea-answers-ms'),
        linkTriggerControl:
            isFeatureEnabled('sea-linkTriggerControl2') && !isFeatureEnabled('sea-answers-sdf'),
        personTriggerControl:
            isFeatureEnabled('sea-peopleTriggerControl3') && !isFeatureEnabled('sea-answers-sdf'),
        enableMultiEntityCalendarAnswer:
            isFeatureEnabled('sea-fetchEvents2') ||
            isFeatureEnabled('sea-answers-sdf') ||
            isFeatureEnabled('sea-answers-ms') ||
            isFeatureEnabled('sea-calendarTriggerControl2'),
        enableMultiEntityFileAnswer:
            isFeatureEnabled('sea-fetchFiles4') ||
            isFeatureEnabled('sea-answers-sdf') ||
            isFeatureEnabled('sea-answers-ms') ||
            isFeatureEnabled('sea-fileTriggerControl4'),
        disableMsbApis: true,
        enableFileAnswerV2: isFeatureEnabled('sea-fileAnswer-v2'),
        enableFileAnswerV3: isFeatureEnabled('sea-fileAnswer-v3'),
        enableCalendarAnswerV2: isFeatureEnabled('sea-calendarAnswer-v2'),
        enableCalendarInsights: isFeatureEnabled('sea-calendarAnswer-v2'),
        isTeamsChatFeatureEnabled: isFeatureEnabled('sea-peopleQueryTeamsChat'),
    };
}

function getUserProperties() {
    const sessionSettings = getUserConfiguration().SessionSettings;

    if (!sessionSettings) {
        return undefined;
    }

    const { UserEmailAddress, UserDisplayName, UserPrincipalName, CompanyName } = sessionSettings;

    if (
        !UserEmailAddress ||
        !UserDisplayName ||
        !UserPrincipalName ||
        (isBusiness() && !CompanyName)
    ) {
        return undefined;
    }

    return {
        userData: {
            mail: UserEmailAddress,
            displayName: UserDisplayName,
            userPrincipalName: UserPrincipalName,
        },
        userOrganization: {
            displayName: CompanyName,
        },
    };
}

/**
 * This helper function checks the default shouldStartSearch function used to
 * check if we should fetch search results, as well as additional checks to ensure
 * answers are fetched when appropriate.
 */
function shouldFetchAnswer(
    scenarioId: SearchScenarioId,
    actionSource: ActionSource,
    currentSearchQueryId: string
) {
    const logicalId = getScenarioStore(SearchScenarioId.Mail).currentSearchQueryId;
    if (!logicalId || currentSearchQueryId !== logicalId) {
        logUsage('Search_Answers_LogicalIDMismatch', {
            serpId: currentSearchQueryId,
            storeId: logicalId,
        });
        return false;
    }

    if (!getIs3SServiceAvailable()) {
        logUsage('Search_Answers_3SServiceUnavailable', {
            logicalId: currentSearchQueryId,
        });
        return false;
    }
    /**
     * Checks if answers enabled at a base level for the user (checks if feature
     * flags are enabled, checks if answers are enabled for the user type, checks
     * if 3S service is available).
     */
    if (!isAnswerFeatureEnabled()) {
        return false;
    }

    // If the previous 3S query call fails, we fall back to execute search.
    // Don't make an answers request in this case
    if (actionSource === 'SearchErrorFallback') {
        return false;
    }

    // Answers should only be requested if search results are also being requested.
    if (!shouldStartSearch(scenarioId, actionSource)) {
        return false;
    }

    // Do not fetch Answers in explicit log on scenario even if 3S is used for SERP
    if (getUserConfiguration().SessionSettings.IsExplicitLogon) {
        return false;
    }

    // Answers should only be requested when using 3S to fetch search results.
    if (
        getSearchProvider() !== SearchProvider.Substrate &&
        getSearchProvider() !== SearchProvider.SubstrateV2
    ) {
        logUsage('Search_Answers_3SSearchNotRequested', {
            logicalId: currentSearchQueryId,
        });
        return false;
    }

    const searchScope = getSelectedSearchScope();
    const folderName = searchScope && getFolderNameFromScope(searchScope);
    const searchScopeOption = getOptionsForFeature<OwaSearchOptions>(OwsOptionsFeatureType.Search)
        .defaultSearchScope;

    /**
     * Answers should only be fetched in the All folder scope
     * Unless the default scope option is Current Folder, then it should also be fetched in Inbox scope
     */
    switch (searchScopeOption) {
        case SearchScope.AllFolders:
        case SearchScope.AllFoldersInbox: {
            if (folderName !== 'msgfolderroot') {
                return false;
            }
            break;
        }
        case SearchScope.CurrentFolder: {
            if (folderName !== 'msgfolderroot' && folderName !== 'inbox') {
                return false;
            }
            break;
        }
    }

    return true;
}

function onSubstrateAnswersSearchResponseCallback(response: any): void {
    if (response?.AnswerEntitySets) {
        onAnswerAvailable();
    }
}

function logAnswerEvents(event: IEvent) {
    if (
        event.featureName == 'MicrosoftSearchRoundTripTimeEvent' &&
        event.eventId == 'SubstrateSearch_RoundTripTime' &&
        isFeatureEnabled('fwk-devTools')
    ) {
        const searchInstrumentation = buildInstrumentation(event);
        lazyAddSearchRequestInstrumentation
            .import()
            .then(addSearchRequestInstrumentation =>
                addSearchRequestInstrumentation(searchInstrumentation)
            );
    }
}

function buildInstrumentation(event: IEvent): SearchRequestInstrumentation {
    return {
        ClientSearchProvider: SearchProvider.Substrate,
        PageNumber: 'Answer',
        ClientNetworkTime: parseInt(event.properties.duration as string),
        ClientJSEndToEndTime: 0,
        ClientJSPreRequestTime: 0,
        ClientJSRequestThreadTime: 0,
        ClientResponseProcessTime: 0,
        ClientJSRenderingTime: 0,
        SearchDateTime: null,
        SearchBETarget: '',
        SearchFETarget: '',
        SearchBEHttpStatus: event.properties.status as string,
        SearchMsEdgeRef: '',
        SearchErrorContent: event.properties.errorMessage as string,
        SearchTraceID: event.properties.traceId as string,
        SearchQueryId: event.properties.logicalSearchId as string,
        ClientBuildNumber: getClientVersion(),
        ClientTimeSentUTC: new Date(event.properties.startDateTime as string),
        ClientTimeFinishedUTC: new Date(event.properties.endDateTime as string),
        ClientHttpStatus: event.properties.duration
            ? parseInt(event.properties.status as string)
            : -1,
        SearchClientSessionID: '',
        SearchClientRequestID: getClientId(),
        ClientName: event.properties.clientId as string,
        DiagnosticsCheckpoints: null,
        ResourceTimingEntry: null,
        PIIData: { queryText: getSearchQueryString() },
    };
}

function getEntityTypes(): AnswerEntityType[] {
    const is3SServiceAvailable = getIs3SServiceAvailable();
    if (!is3SServiceAvailable) {
        return [];
    }
    if (isBusiness()) {
        return [
            ...(isFeatureEnabled('sea-fetchAcronyms3') ||
            isFeatureEnabled('sea-acronymTriggerControl3') ||
            isFeatureEnabled('sea-answers-sdf')
                ? ['Acronym' as AnswerEntityType]
                : []),
            ...(isFeatureEnabled('sea-fetchBookmarks2') ||
            isFeatureEnabled('sea-bookmarkTriggerControl2') ||
            isFeatureEnabled('sea-answers-sdf')
                ? ['Bookmark' as AnswerEntityType]
                : []),
            ...(isFeatureEnabled('sea-fetchPeople3') ||
            isFeatureEnabled('sea-peopleTriggerControl3') ||
            isFeatureEnabled('sea-answers-sdf')
                ? ['People' as AnswerEntityType]
                : []),
            ...(isFeatureEnabled('sea-fetchEvents2') ||
            isFeatureEnabled('sea-calendarTriggerControl2') ||
            isFeatureEnabled('sea-answers-sdf') ||
            isFeatureEnabled('sea-answers-ms')
                ? ['Event' as AnswerEntityType]
                : []),
            ...(isFeatureEnabled('sea-fetchFlights2') ||
            isFeatureEnabled('sea-flightTriggerControl2')
                ? ['Flight' as AnswerEntityType]
                : []),
            ...(isFeatureEnabled('sea-fetchFiles4') ||
            isFeatureEnabled('sea-fileTriggerControl4') ||
            isFeatureEnabled('sea-answers-sdf') ||
            isFeatureEnabled('sea-answers-ms')
                ? ['File' as AnswerEntityType]
                : []),
            ...(isFeatureEnabled('sea-fetchLinks2') ||
            isFeatureEnabled('sea-linkTriggerControl2') ||
            isFeatureEnabled('sea-answers-sdf')
                ? ['Link' as AnswerEntityType]
                : []),
        ];
    } else {
        return [
            ...(isFeatureEnabled('sea-fetchEvents2') ||
            isFeatureEnabled('sea-calendarTriggerControl2') ||
            isFeatureEnabled('sea-answers-sdf')
                ? ['Event' as AnswerEntityType]
                : []),
            ...(isFeatureEnabled('sea-fetchFlights2') ||
            isFeatureEnabled('sea-flightTriggerControl2')
                ? ['Flight' as AnswerEntityType]
                : []),
            ...(isFeatureEnabled('sea-fetchFiles4') ||
            isFeatureEnabled('sea-fileTriggerControl4') ||
            isFeatureEnabled('sea-answers-sdf')
                ? ['File' as AnswerEntityType]
                : []),
            ...(isFeatureEnabled('sea-fetchPeople3') ||
            isFeatureEnabled('sea-peopleTriggerControl3') ||
            isFeatureEnabled('sea-answers-sdf')
                ? ['People' as AnswerEntityType]
                : []),
        ];
    }
}
