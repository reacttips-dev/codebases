import type ScopeOption from '../store/schema/ScopeOption';
import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import type {
    FileSuggestion,
    MessageSuggestion,
    Suggestion,
    SearchScope,
} from 'owa-search-service';
import type { FileSuggestionImmersiveViewSupported } from 'owa-search-service/lib/data/schema/SuggestionSet';
import type { RefinerType } from '../store/schema/RefinerType';
import type { OwaDate } from 'owa-datetime';
import type { ReadWriteRecipientViewState } from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import type { PeopleSearchPrefix } from '../store/schema/PeopleSearchPrefix';
import type { SearchScenarioId } from 'owa-search-store';

// Deletes non-QF cached suggestion set with the given key from the store.
export const deleteCachedSuggestionSet = action(
    'DELETE_CACHED_SUGGESTION_SET',
    (searchText: string) => ({
        searchText: searchText,
    })
);

// Loads selected MessageSuggestion's message in RP.
export const loadMessageSuggestion = action(
    'loadMessageSuggestion',
    (suggestion: MessageSuggestion) =>
        addDatapointConfig(
            {
                name: 'Search_LoadMessageSuggestion',
            },
            {
                suggestion: suggestion,
            }
        )
);

// Dispatched when the advanced search UI mounts.
export const onAdvancedSearchMounted = action('ON_ADVANCED_SEARCH_MOUNTED');

/**
 * Dispatched when the user selects an option from the folders dropdown control
 * in the advanced search UI.
 */
export const onFolderDropdownOptionSelected = action(
    'ON_FOLDER_DROPDOWN_OPTION_SELECTED',
    (selectedScopeOption: ScopeOption) => ({
        selectedScopeOption,
    })
);

// Dispatched when the keywords field is changed in the advanced search UI.
export const onKeywordsFieldChanged = action('ON_KEYWORDS_FIELD_CHANGED', (value: string) => ({
    value,
}));

// Dispatched when the "From" date picker value changes.
export const onFromDateChanged = action('ON_FROM_DATE_CHANGED', (value: OwaDate) => ({
    value,
}));

// Dispatched when the "To" date picker value changes.
export const onToDateChanged = action('ON_TO_DATE_CHANGED', (value: OwaDate) => ({
    value,
}));

// Dispatched when the "Has attachments" checkbox value changes.
export const onHasAttachmentsCheckboxChanged = action(
    'ON_HAS_ATTACHMENTS_CHECKBOX_CHANGED',
    (value: boolean) => ({
        value,
    })
);

// Dispatched when "Search" button is clicked in advanced search UI.
export const onAdvancedSearchSearchButtonClicked = action(
    'ON_ADVANCED_SEARCH_SEARCH_BUTTON_CLICKED'
);

// Dispatched when "Clear filters" button is clicked in advanced search UI.
export const onClearFiltersButtonClicked = action('ON_CLEAR_FILTERS_BUTTON_CLICKED');

// Dispatched when advanced search UI should be dismissed.
export const onAdvancedSearchUiDismissed = action('ON_ADVANCED_SEARCH_UI_DISMISSED');

// Dispatched after a refiner is changed.
export const onRefinerChanged = action('ON_REFINER_CHANGED', (refinerType: RefinerType) => ({
    refinerType,
}));

// Dispatched when the subject field is changed in the advanced search UI.
export const onSubjectFieldChanged = action('ON_SUBJECT_FIELD_CHANGED', (value: string) => ({
    value,
}));

export const setFromDate = action('SET_FROM_DATE', (fromDate: OwaDate) => ({
    fromDate,
}));

export const setIncludeAttachments = action(
    'SET_INCLUDE_ATTACHMENTS',
    (includeAttachments: boolean) => ({
        includeAttachments,
    })
);

export const setToDate = action('SET_TO_DATE', (toDate: OwaDate) => ({
    toDate,
}));

/**
 * Opens SxS/ReadingPane for a file suggestion
 * @param suggestion The file suggestion
 */
export const showSxSForFileSuggestion = action(
    'showSxSForFileSuggestion',
    (suggestion: FileSuggestion) => ({
        suggestion: suggestion,
    })
);

// Updates non-QF cached suggestion set with the given key in the store.
export const updateCachedSuggestionSet = action(
    'UPDATE_CACHED_SUGGESTION_SET',
    (searchText: string, suggestions: Suggestion[]) => ({
        searchText: searchText,
        suggestions: suggestions,
    })
);

// Updates "IsComplete" property of suggestion set in the store.
export const updateIsSuggestionSetComplete = action(
    'UPDATE_IS_SUGGESTION_SET_COMPLETE',
    (searchText: string, isComplete: boolean) => ({
        searchText: searchText,
        isComplete: isComplete,
    })
);

// Updates advanced search people pickers.
export const onAdvancedSearchPeoplePickersInitialized = action(
    'ON_ADVANCED_SEARCH_PEOPLE_PICKERS_INITIALIZED',
    (
        fromPickerValues: ReadWriteRecipientViewState[],
        toPickerValues: ReadWriteRecipientViewState[],
        ccPickerValues: ReadWriteRecipientViewState[]
    ) => ({
        fromPickerValues,
        toPickerValues,
        ccPickerValues,
    })
);

/**
 * Adds persons to an advanced search people picker.
 * @persons Person objects to add to picker
 * @isFromPicker Designates if it's the "From" picker if true, "To" picker if false.
 */
export const addPersonsAdvancedSearch = action(
    'ADD_PERSONS_ADVANCED_SEARCH',
    (personsToAdd: ReadWriteRecipientViewState[], peopleSearchPrefix: PeopleSearchPrefix) => ({
        personsToAdd,
        peopleSearchPrefix,
    })
);

/**
 * Edits persons in an advanced search people picker.
 */
export const editPersonsAdvancedSearch = action(
    'EDIT_PERSON_ADVANCED_SEARCH',
    (oldPerson: ReadWriteRecipientViewState, newPerson: ReadWriteRecipientViewState) => ({
        oldPerson,
        newPerson,
    })
);

/**
 * Remove persons from an advanced search people picker.
 * @persons Person objects to remove to picker
 * @isFromPicker Designates if it's the "From" picker if true, "To" picker if false.
 */
export const removePersonAdvancedSearch = action(
    'REMOVE_PERSON_ADVANCED_SEARCH',
    (personToRemove: ReadWriteRecipientViewState, peopleSearchPrefix: PeopleSearchPrefix) => ({
        personToRemove,
        peopleSearchPrefix,
    })
);

export const onDismissAdvanceSearchUi = action('ON_DISMISS_ADVANCE_SEARCH_UI');

export const onFolderScopeUpdate = action(
    'onFolderScopeUpdate',
    (selectedSearchScope: SearchScope) => ({
        selectedSearchScope,
    })
);

export const onInitializationDone = action('onInitializationDone', () => ({}));

export const startAnswerSearch = action(
    'START_ANSWER_SEARCH',
    (actionSource: string, scenarioId: SearchScenarioId, currentSearchQueryId: string) => {
        return {
            actionSource,
            scenarioId,
            currentSearchQueryId,
        };
    }
);

export const onAnswersLocalizationCompleted = action('onAnswersLocalizationCompleted', () => ({}));

export const toggleHasAttachments = action('toggleHasAttachments');

export const toggleIsUnread = action('toggleIsUnread');

export const toggleIsToMe = action('toggleIsToMe');

export const toggleIsFlagged = action('toggleIsFlagged');

export const toggleIsMentioned = action('toggleIsMentioned');

export const onAnswerAvailable = action('onAnswerAvailable');

export const updateFileSuggestionImmersiveViewSupported = action(
    'updateFileSuggestionImmersiveViewSupported',
    (suggestion: FileSuggestion, immersiveViewSupported: FileSuggestionImmersiveViewSupported) => ({
        suggestion,
        immersiveViewSupported,
    })
);
