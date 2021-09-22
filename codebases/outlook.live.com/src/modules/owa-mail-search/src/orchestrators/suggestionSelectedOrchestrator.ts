import { loadMessageSuggestion, showSxSForFileSuggestion } from '../actions/internalActions';
import isMailSearchAction from '../utils/isMailSearchAction';
import { getUserMailboxInfo, ClientItemId } from 'owa-client-ids';
import { getGuid } from 'owa-guid';
import { lazyPopoutCalendarReadingPane } from 'owa-popout-calendar';
import { lazyLogSearchEntityActions } from 'owa-search-instrumentation';
import {
    SubstrateSearchScenario,
    Suggestion,
    KeywordSuggestion,
    PeopleSuggestion,
    MessageSuggestion,
    FileSuggestion,
    EventSuggestion,
    CategorySearchSuggestion,
    SuggestionKind,
    TrySearchSuggestion,
} from 'owa-search-service';
import setNextSearchQueryId from 'owa-search/lib/mutators/setNextSearchQueryId';
import { lazyOpenEventDetailsView } from 'owa-time-panel';
import { isTimePanelAvailable } from 'owa-time-panel-bootstrap';
import { orchestrator } from 'satcheljs';
import { is3SServiceAvailable, lazyIsSearchBoxEmpty } from 'owa-search';
import {
    addSuggestionPill,
    endSearchConversation,
    lazySetIsSuggestionsDropdownVisible,
    onSearchTextChanged,
    startSearch,
    suggestionSelected,
} from 'owa-search-actions';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { FileSuggestionImmersiveViewSupported } from 'owa-search-service/lib/data/schema/SuggestionSet';
import { logUsage } from 'owa-analytics';

export default orchestrator(suggestionSelected, async actionMessage => {
    if (!isMailSearchAction(actionMessage.scenarioId)) {
        return;
    }

    const { suggestion, suggestionSetTraceId } = actionMessage;

    // Hide suggestions dropdown.
    const setIsSuggestionsDropdownVisible = await lazySetIsSuggestionsDropdownVisible.import();
    setIsSuggestionsDropdownVisible(false, SearchScenarioId.Mail);

    switch (suggestion.kind) {
        case SuggestionKind.Keywords: {
            handleKeywordSuggestion(suggestion, suggestionSetTraceId);
            break;
        }
        case SuggestionKind.People: {
            handlePeopleSuggestion(suggestion, suggestionSetTraceId);
            break;
        }
        case SuggestionKind.Category: {
            handleCategorySuggestion(suggestion, suggestionSetTraceId);
            break;
        }
        case SuggestionKind.Message: {
            handleMessageSuggestion(suggestion, suggestionSetTraceId);
            break;
        }
        case SuggestionKind.File: {
            handleFileSuggestion(suggestion as FileSuggestion, suggestionSetTraceId);
            break;
        }
        case SuggestionKind.Event: {
            handleEventSuggestion(suggestion, suggestionSetTraceId);
            break;
        }
        case SuggestionKind.TrySuggestion: {
            handleTrySuggestion(suggestion, suggestionSetTraceId);
            break;
        }
        default:
            break;
    }
});

// Log suggestion click if QF is enabled (and it's a QF suggestion).
// VSO: 32699 - Add Suggestion source to other types of suggestions as well
function logEntityClicked(suggestion: Suggestion, suggestionSetTraceId: string) {
    // log if traceId is not null
    if (is3SServiceAvailable() && suggestionSetTraceId) {
        const store = getScenarioStore(SearchScenarioId.Mail);
        const logicalId = store.traceIdToLogicalIdMap.get(suggestionSetTraceId);
        lazyLogSearchEntityActions.importAndExecute(
            SubstrateSearchScenario.Mail,
            null,
            null,
            logicalId,
            null /* traceId */,
            suggestion.ReferenceId,
            'EntityClicked'
        );
    }
}

function handleKeywordSuggestion(suggestion: KeywordSuggestion, suggestionSetTraceId: string) {
    // Update the search box text.
    onSearchTextChanged(suggestion.QueryText, SearchScenarioId.Mail);

    // Log suggestion clicked.
    logEntityClicked(suggestion, suggestionSetTraceId);
    // Kick off search with selected suggestion.
    startSearch('SearchBoxSuggestionDropDown', SearchScenarioId.Mail, false /* explicitSearch */);
}

function handleTrySuggestion(suggestion: TrySearchSuggestion, suggestionSetTraceId: string) {
    // Update the search box text.
    onSearchTextChanged(suggestion.QueryText, SearchScenarioId.Mail);

    // Log suggestion clicked.
    logEntityClicked(suggestion, suggestionSetTraceId);
    // Kick off search with selected suggestion.
    startSearch('SearchBoxSuggestionDropDown', SearchScenarioId.Mail, false /* explicitSearch */);
}

function handlePeopleSuggestion(suggestion: PeopleSuggestion, suggestionSetTraceId: string) {
    // Add suggestion pill to search box.
    addSuggestionPill(suggestion, true /* suggestionSelected */, SearchScenarioId.Mail);

    // Log suggestion clicked.
    logEntityClicked(suggestion, suggestionSetTraceId);
    // Kick off search with selected suggestion.
    startSearch('SearchBoxSuggestionDropDown', SearchScenarioId.Mail, false /* explicitSearch */);
}

function handleCategorySuggestion(
    suggestion: CategorySearchSuggestion,
    suggestionSetTraceId: string
) {
    // Add suggestion pill to search box.
    addSuggestionPill(suggestion, true /* suggestionSelected */, SearchScenarioId.Mail);

    // Log suggestion clicked.
    logEntityClicked(suggestion, suggestionSetTraceId);
    // Kick off search with selected suggestion.
    startSearch('SearchBoxSuggestionDropDown', SearchScenarioId.Mail, false /* explicitSearch */);
}

function handleMessageSuggestion(suggestion: MessageSuggestion, suggestionSetTraceId: string) {
    // Update the search box text.
    onSearchTextChanged(
        getScenarioStore(SearchScenarioId.Mail).searchTextForSuggestion,
        SearchScenarioId.Mail
    );

    // Log suggestion clicked.
    logEntityClicked(suggestion, suggestionSetTraceId);

    endConversationForDirectNav();

    // Load selected message in RP.
    loadMessageSuggestion(suggestion);
}

async function handleFileSuggestion(suggestion: FileSuggestion, suggestionSetTraceId: string) {
    const showSxS: boolean =
        suggestion.ImmersiveViewSupported === FileSuggestionImmersiveViewSupported.Supported;
    logEntityClicked(suggestion, suggestionSetTraceId);
    const isSearchBoxEmpty = await lazyIsSearchBoxEmpty.import();
    logUsage('Search_FileSuggestionSelected', {
        SearchScenarioId: SearchScenarioId.Mail,
        FileSuggestionType: suggestion.FileSuggestionType,
        FileExtension: suggestion.FileExtension,
        WillOpenInSxS: showSxS,
        IsSearchBoxEmpty: isSearchBoxEmpty(SearchScenarioId.Mail),
        SuggestionSetTraceId: suggestionSetTraceId,
    });
    endConversationForDirectNav();

    if (showSxS) {
        showSxSForFileSuggestion(suggestion);
    }
}

function handleEventSuggestion(suggestion: EventSuggestion, suggestionSetTraceId: string) {
    logEntityClicked(suggestion, suggestionSetTraceId);

    const eventId: ClientItemId = {
        Id: suggestion.EventId,
        mailboxInfo: getUserMailboxInfo(),
    };

    if (isTimePanelAvailable()) {
        lazyOpenEventDetailsView.importAndExecute('SearchBoxSuggestionDropDown', eventId);
    } else {
        lazyPopoutCalendarReadingPane.importAndExecute(
            eventId,
            'SearchBoxSuggestionDropDown',
            null /* data */
        );
    }

    endConversationForDirectNav();
}

/**
 * End a conversation when a direct nav is selected. We dispatch the
 * endSearchConversation AND the setNextSearchQueryId action because the
 * nextSearchQueryId is not changed when a direct nav is selected (unlike for
 * actual search suggestions where the value is changed before the search
 * is executed).
 */
const endConversationForDirectNav = () => {
    endSearchConversation(SearchScenarioId.Mail);
    setNextSearchQueryId(getGuid(), SearchScenarioId.Mail);
};
