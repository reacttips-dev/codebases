// Register mutators
import './mutators/currentSuggestionsMutators';
import './mutators/resetCurrentSuggestionsMutator';
import './mutators/setIsSuggestionsDropdownVisibleMutator';
import './mutators/setSearchTextMutator';
import './mutators/addSuggestionPillInternalMutator';
import './mutators/setLatestTraceIdMutator';
import './mutators/searchBoxHasFocusMutators';
import './mutators/setSearchTextForSuggestionMutator';
export { default as setLatestRenderedQFTraceId } from './mutators/setLatestRenderedQFTraceId';
import './orchestrators/endSearchConversationOrchestrator';
import './mutators/startSearchMutator';
import './mutators/mapTraceIdToLogicalIdMutator';

// Register orchestrators
import './orchestrators/onSearchInputFocusedOrchestrator';
import './orchestrators/onEnterPressedSearchInputOrchestrator';
import './orchestrators/onSearchTextChangedOrchestrator';
import './orchestrators/startSearchSessionOrchestrator';
import './orchestrators/registerAdditionalQuickActionsOrchestrator';
import './orchestrators/addSuggestionPillOrchestrator';
import './mutators/endSearchConversationMutator';

// Required for actions that depend on them.

// Export selectors, interfaces, enums, constants
export { default as getHighlightTerms } from './selectors/getHighlightTerms';
export { START_MATCH_DELIMITER, END_MATCH_DELIMITER } from 'owa-search-constants';
export type { SearchBoxContainerHandle } from './types/SearchBoxContainerHandle';
export type { InstrumentationContext } from './types/InstrumentationContext';

// Export utils
export { default as getSubstrateSearchScenarioBySearchScenarioId } from './utils/getSubstrateSearchScenarioBySearchScenarioId';
export { default as getXClientFlightsHeaderValue } from './utils/getXClientFlightsHeaderValue';
export { default as is3SServiceAvailable } from './utils/is3SServiceAvailable';
export { default as getSearchBoxIdByScenarioId } from './utils/getSearchBoxIdByScenarioId';
export { default as isModernFilesEnabled } from './utils/isModernFilesEnabled';

// Export components
export { default as SearchBox } from './components/SearchBox';

// Export selectors
export { default as getSearchBoxWidth } from './selectors/getSearchBoxWidth';
export { default as queryIncludesKQLSuggestion } from './selectors/queryIncludesKQLSuggestion';

export {
    lazySetLatestQFRequestId,
    lazySetSpellerData,
    SearchBoxDropdown,
    SearchScopePicker,
    lazyGetSuggestionAtIndex,
    lazyIsInSearchMode,
    lazyIsQFRequestIdEqualToLatest,
    lazyIsSearchBoxEmpty,
    lazyIsFromPersona,
    lazyIsToPersona,
} from './lazyFunctions';
