import type { default as SearchStore, SearchScenarioStore } from './schema/SearchStore';
import { ObservableMap } from 'mobx';
import type { PillSuggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';
import { createStore } from 'satcheljs';

export const createDefaultSearchStore = (): SearchScenarioStore => {
    return {
        alteredQuery: '',
        alterationProviderId: null,
        answerPlaceholderId: null,
        currentSearchQueryId: null,
        currentSuggestions: null,
        displayedQFRequestTime: null,
        flaggedTokens: [],
        isAnswerRendered: false,
        isLastKeyPressedDeletion: false,
        isSuggestionsCalloutClickable: false,
        isSuggestionsDropdownVisible: false,
        isUsing3S: null,
        latestQFRequestId: null,
        latestRenderedQFTraceId: null,
        latestQFTraceId: null,
        latestTraceId: null,
        nextSearchQueryId: null,
        recourseQuery: '',
        searchBoxHasFocus: false,
        searchBoxWidth: null,
        searchSessionGuid: null,
        searchText: '',
        searchTextForSuggestion: '',
        selectedPillIndex: -1,
        selectedSuggestionIndex: -1,
        showRefiners: false,
        showSearchBoxInCompactMode: false,
        suggestedSearchTerm: '',
        suggestedSearchTermReferenceId: '',
        suggestionPillIds: [],
        suggestionPills: new ObservableMap<string, PillSuggestion>(),
        queryAlterationType: null,
        queryActionSource: null,
        queryAlterationLogicalId: null,
        alterationDisplayText: '',
        traceIdToLogicalIdMap: new ObservableMap<string, string>(), // Map of Trace Ids to Logical Ids
        tableViewId: null,
        isScopePickerVisible: false,
        filters: [],
    };
};

export const searchStore: SearchStore = {
    scenarioStores: new ObservableMap<string, SearchScenarioStore>(),
};

export const getStore = createStore<SearchStore>('commonSearchStore', searchStore);
export default getStore;
