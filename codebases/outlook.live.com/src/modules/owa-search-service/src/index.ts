/**
 * Functions that are time sensitive (executeSearchService, substrateSearchService,
 * substrateSearchSuggestionsService) should never be lazily exported as they will
 * go through a Promise resolve which will delay the request from going out.
 */
export { default as substrateSearchService } from './services/substrateSearchService';
export { default as substrateSearchSuggestionsService } from './services/substrateSearchGetSuggestionsService';

export { default as compareSearchScope } from './helpers/searchScope/compareSearchScope';
export { getKey, getSearchScopeList } from './helpers/searchScope/SearchScenario';

export {
    lazyLogLocalContentDataSource,
    lazyLogLocalContentLayout,
    lazyClearLocalContentInstrumentationCache,
    lazyGetLocalContentId,
    lazySubstrateSearchInitOperation,
    lazySubstrateSearchPostSuggestionsService,
    lazyDeleteSubstrateSearchHistoryService,
    lazyExportSubstrateSearchHistoryService,
} from './lazyFunctions';

export { default as getSubstrateSearchEndpoint } from './helpers/getSubstrateSearchEndpoint';
export { default as getSearchRestrictions } from './helpers/getSearchRestrictions';
export { default as createDateTimeRangeFilter } from './helpers/request/entityRequest/createDateTimeRangeFilter';
export { default as createFoldersFilter } from './helpers/request/entityRequest/createFoldersFilter';
export { default as getTimeZone } from './helpers/request/getTimeZone';
export { default as getSearchResultSet } from './helpers/response/getSearchResultSet';
export { default as convertSearchResultEventToCalendarItemType } from './helpers/response/convertSearchResultEventToCalendarItemType';
export { default as convertSearchResultConversationToConversationType } from './helpers/response/convertSearchResultConversationToConversationType';
export { default as convertSearchResultMessageToMessageType } from './helpers/response/convertSearchResultMessageToMessageType';
export { default as convertSearchResultTeamsMessageToTeamsMessageType } from './helpers/response/convertSearchResultTeamsMessageToTeamsMessageType';
export { convertSearchQueryId } from './helpers/response/converterHelpers';
export { default as createEmptySearchResult } from './helpers/response/createEmptySearchResponse';
export { default as convertDynamicRefinersToRefiners } from './helpers/request/convertDynamicRefinersToRefiners';
export { default as convertItemTypesToEntityType } from './helpers/request/convertItemTypesToEntityType';

export {
    primaryMailboxSearchScope,
    archiveMailboxSearchScope,
    sharedFoldersSearchScope,
    singleGroupSearchScope,
    SearchScopeKind,
    publicFolderSearchScope,
} from './data/schema/SearchScope';
export type {
    SearchScope,
    PrimaryMailboxSearchScope,
    ArchiveMailboxSearchScope,
    SharedFoldersSearchScope,
    SingleGroupSearchScope,
    PublicFolderSearchScope,
} from './data/schema/SearchScope';

export { getLocalTime } from './helpers/getLocalTime';
export { getPageContext, getNextPageContext, getPageContextByOffset } from './helpers/pageContext';
export type { PageContext } from './helpers/pageContext';
export type { default as FlaggedToken } from './data/schema/FlaggedToken';
export type { default as ConnectedAccountInfo } from './data/schema/ConnectedAccountInfo';
export { default as SearchProvider } from './data/schema/SearchProvider';

export type {
    default as SubstrateSearchRequest,
    AndFilter,
    EntityRequest,
    EntityRequestV1,
    EntityType,
    FilterBase,
    OrFilter,
    RangeFilter,
    SearchSortOrder,
    SortDirection,
    TermFilter,
} from './data/schema/SubstrateSearchRequest';
export {
    SearchResultBusyType,
    SearchResultCalendarItemType,
} from './data/schema/SubstrateSearchResponse';
export type {
    default as SubstrateSearchResponse,
    EntitySet,
    QueryAlterationType,
    SearchResult,
    SearchResultConversation,
    SearchResultEvent,
    SearchResultMessage,
    SearchResultTeamsMessage,
    SearchResultSet,
    TeamsMessage,
} from './data/schema/SubstrateSearchResponse';
export type { Provenance } from './data/schema/SubstrateSearchShared';
export { buildInstrumentation } from './services/makeSearchRequest';
export { default as SubstrateSearchScenario } from './data/schema/SubstrateSearchScenario';

export type { default as SearchRequestInstrumentation } from './data/schema/SearchRequestInstrumentation';

export type {
    LocalContentInstrumentationContext,
    LocalContentLayout,
    LocalContentProvider,
    LocalContentType,
} from './actions/substrateSearchLogLocalContentEvents';
export type { LocalContentLayoutGroup } from './actions/substrateSearchLogLocalContentEvents';

export type {
    SubstrateSearchSuggestionsResponseModernFileSuggestionsGroup,
    SubstrateSearchSuggestionsResponseOdspFileGroup,
    SubstrateSearchSuggestionsResponseTextSuggestion,
    SubstrateSearchSuggestionsResponsePeopleSuggestion,
    SubstrateSearchSuggestionsResponseMessageSuggestion,
    SubstrateSearchSuggestionsResponseAttachmentFileSuggestion,
    SubstrateSearchSuggestionsResponseFileSuggestion,
    SubstrateSearchSuggestionsResponseEventSuggestion,
    default as SubstrateSearchSuggestionsResponse,
} from './data/schema/SubstrateSearchSuggestionsResponse';
export {
    FileSuggestionType,
    SuggestionKind,
    FileSuggestionImmersiveViewSupported,
} from './data/schema/SuggestionSet';
export type {
    default as SuggestionSet,
    KeywordSuggestion,
    PeopleSuggestion,
    PrivateDistributionListSuggestion,
    MessageSuggestion,
    CategorySearchSuggestion,
    PillSuggestion,
    FileSuggestion,
    EventSuggestion,
    Suggestion,
    SuggestionSource,
    TrySearchSuggestion,
} from './data/schema/SuggestionSet';
