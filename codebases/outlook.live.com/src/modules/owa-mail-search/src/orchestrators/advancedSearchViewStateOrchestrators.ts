import { setStaticSearchScope, setShouldShowAdvancedSearch } from '../actions/publicActions';
import { getStore } from '../store/store';
import { PeopleSearchPrefix } from '../store/schema/PeopleSearchPrefix';
import isDuplicatePeopleSuggestion from '../utils/isDuplicatePeopleSuggestion';
import getSelectedSearchScope from '../utils/getSelectedSearchScope';
import { getGuid } from 'owa-guid';
import convertSubstrateSuggestionsResponseToSuggestionSet from './getSuggestions/convertSubstrateSuggestionsResponseToSuggestionSet';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import { RecipientExpansionStatus } from 'owa-recipient-types/lib/types/RecipientExpansionStatus';
import { orchestrator } from 'satcheljs';
import { formatDate, OwaDate } from 'owa-datetime';
import { lazyIsSearchBoxEmpty, lazyIsFromPersona, lazyIsToPersona } from 'owa-search';
import {
    addSuggestionPill,
    clearSearchBox,
    getSuggestions,
    lazySetIsSuggestionsDropdownVisible,
    onSearchTextChanged,
    setSearchTextForSuggestion,
    startSearch,
} from 'owa-search-actions';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import {
    SubstrateSearchScenario,
    substrateSearchSuggestionsService,
    SuggestionKind,
    PeopleSuggestion,
} from 'owa-search-service';
import {
    onAdvancedSearchMounted,
    onAdvancedSearchPeoplePickersInitialized,
    onAdvancedSearchSearchButtonClicked,
    onDismissAdvanceSearchUi,
    onAdvancedSearchUiDismissed,
    setFromDate,
    setToDate,
    setIncludeAttachments,
} from '../actions/internalActions';
import { logUsage } from 'owa-analytics';
import { getAggregationBucket } from 'owa-analytics-actions';
import createPersonaSearchQueryString from '../utils/createPersonaSearchQueryString';
import getIsSearchingWithinFromFolder from '../selectors/getIsSearchingWithinFromFolder';

orchestrator(onAdvancedSearchMounted, async () => {
    const fromPeople: ReadWriteRecipientViewState[] = [];
    const toPeople: ReadWriteRecipientViewState[] = [];
    const ccPeople: ReadWriteRecipientViewState[] = [];

    // Fetch suggestions based on search box text and people pills
    await parseSearchBoxText(fromPeople, toPeople, ccPeople);
    await parsePeoplePills(fromPeople, toPeople, ccPeople);

    // Dispatch action to update store with fetched suggestions.
    onAdvancedSearchPeoplePickersInitialized(fromPeople, toPeople, ccPeople);
});

/**
 * When advanced search UI's "Search" button is clicked, the first step is to
 * convert the form to KQL and update the search box. Afterwards, we dispatch
 * an action to kick off the search and dismiss the advanced search UI.
 */
orchestrator(onAdvancedSearchSearchButtonClicked, async () => {
    // Update search box with form values.
    updateSearchBox();

    // Kick off a search if the search box isn't empty.
    const isSearchBoxEmpty = await lazyIsSearchBoxEmpty.import();
    if (!isSearchBoxEmpty(SearchScenarioId.Mail)) {
        startSearch('SearchScopeRefiner', SearchScenarioId.Mail, true /* explicitSearch */);
    }

    // Finally dismiss the UI.
    onAdvancedSearchUiDismissed();
});

orchestrator(onDismissAdvanceSearchUi, () => {
    // Update search box with form values.
    updateSearchBox();

    // Fetch new suggestions to match new state of the search box.
    getSuggestions(SearchScenarioId.Mail);

    // Finally dismiss the UI.
    onAdvancedSearchUiDismissed();
});

orchestrator(setShouldShowAdvancedSearch, async actionMessage => {
    /**
     * If the Advanced Search dropdown is being shown and suggestions dropdown
     * is being shown, hide suggestions dropdown.
     */
    if (
        actionMessage.isVisible &&
        getScenarioStore(SearchScenarioId.Mail).isSuggestionsDropdownVisible
    ) {
        const setIsSuggestionsDropdownVisible = await lazySetIsSuggestionsDropdownVisible.import();
        setIsSuggestionsDropdownVisible(false, SearchScenarioId.Mail);
    }
});

/**
 * Fetches suggestions based off of KQL found search box text.
 */
const parseSearchBoxText = async (
    fromPeople: ReadWriteRecipientViewState[],
    toPeople: ReadWriteRecipientViewState[],
    ccPeople: ReadWriteRecipientViewState[]
): Promise<void> => {
    let { searchText: searchBoxText } = getScenarioStore(SearchScenarioId.Mail);

    // Get 3S people suggestion for each persona KQL (from).
    const FROM_WITH_QUOTES_REGEX = /from:"([^"]+)"/g;
    const fromWithQuotesMatches = searchBoxText.match(FROM_WITH_QUOTES_REGEX);
    if (fromWithQuotesMatches) {
        for (const match of fromWithQuotesMatches) {
            const value = match.substring(6 /* from:" */, match.length - 1);
            const suggestion = await getPeopleSuggestion(value);

            const isDuplicate = isDuplicatePeopleSuggestion(fromPeople, suggestion);
            if (!isDuplicate) {
                fromPeople.push(suggestion);
            }

            // Remove parsed piece from search box text so it doesn't re-match.
            searchBoxText = searchBoxText.replace(match, '');
        }
    }

    // Get 3S people suggestion for each persona KQL (from).
    const FROM_WITHOUT_QUOTES_REGEX = /from:([^ ]+)/g;
    const fromWithoutQuotesMatches = searchBoxText.match(FROM_WITHOUT_QUOTES_REGEX);
    if (fromWithoutQuotesMatches) {
        for (const match of fromWithoutQuotesMatches) {
            const value = match.substring(5 /* from: */, match.length);
            const suggestion = await getPeopleSuggestion(value);

            const isDuplicate = isDuplicatePeopleSuggestion(fromPeople, suggestion);
            if (!isDuplicate) {
                fromPeople.push(suggestion);
            }
        }
    }

    // Get 3S people suggestion for each persona KQL (to).
    const TO_WITH_QUOTES_REGEX = /to:"([^"]+)"/g;
    const toWithQuotesMatches = searchBoxText.match(TO_WITH_QUOTES_REGEX);
    if (toWithQuotesMatches) {
        for (const match of toWithQuotesMatches) {
            const value = match.substring(4 /* to:" */, match.length - 1);
            const suggestion = await getPeopleSuggestion(value);

            const isDuplicate = isDuplicatePeopleSuggestion(toPeople, suggestion);
            if (!isDuplicate) {
                toPeople.push(suggestion);
            }

            // Remove parsed piece from search box text so it doesn't re-match.
            searchBoxText = searchBoxText.replace(match, '');
        }
    }

    // Get 3S people suggestion for each persona KQL (to).
    const TO_WITHOUT_QUOTES_REGEX = /to:([^ ]+)/g;
    const toWithoutQuotesMatches = searchBoxText.match(TO_WITHOUT_QUOTES_REGEX);
    if (toWithoutQuotesMatches) {
        for (const match of toWithoutQuotesMatches) {
            const value = match.substring(3 /* to: */, match.length);
            const suggestion = await getPeopleSuggestion(value);

            const isDuplicate = isDuplicatePeopleSuggestion(toPeople, suggestion);
            if (!isDuplicate) {
                toPeople.push(suggestion);
            }
        }
    }

    // Get 3S people suggestion for each persona KQL (cc).
    const CC_WITH_QUOTES_REGEX = /cc:"([^"]+)"/g;
    const ccWithQuotesMatches = searchBoxText.match(CC_WITH_QUOTES_REGEX);
    if (ccWithQuotesMatches) {
        for (const match of ccWithQuotesMatches) {
            const value = match.substring(4 /* to:" */, match.length - 1);
            const suggestion = await getPeopleSuggestion(value);

            const isDuplicate = isDuplicatePeopleSuggestion(ccPeople, suggestion);
            if (!isDuplicate) {
                ccPeople.push(suggestion);
            }

            // Remove parsed piece from search box text so it doesn't re-match.
            searchBoxText = searchBoxText.replace(match, '');
        }
    }

    // Get 3S people suggestion for each persona KQL (cc).
    const CC_WITHOUT_QUOTES_REGEX = /cc:([^ ]+)/g;
    const ccWithoutQuotesMatches = searchBoxText.match(CC_WITHOUT_QUOTES_REGEX);
    if (ccWithoutQuotesMatches) {
        for (const match of ccWithoutQuotesMatches) {
            const value = match.substring(3 /* to: */, match.length);
            const suggestion = await getPeopleSuggestion(value);

            const isDuplicate = isDuplicatePeopleSuggestion(ccPeople, suggestion);
            if (!isDuplicate) {
                ccPeople.push(suggestion);
            }
        }
    }
};

/**
 * Fetches suggestions based off of people pills in search box.
 */
const parsePeoplePills = async (
    fromPeople: ReadWriteRecipientViewState[],
    toPeople: ReadWriteRecipientViewState[],
    ccPeople: ReadWriteRecipientViewState[]
): Promise<void> => {
    const { suggestionPills, searchSessionGuid } = getScenarioStore(SearchScenarioId.Mail);

    // Get people suggestions from pills.
    for (const pill of suggestionPills.values()) {
        if (pill.kind === SuggestionKind.People) {
            // Determine whether pill is from/to/CC based on query text from 3S and client-side custom KQL
            const isFromPersona = await lazyIsFromPersona.import();
            const isFromPill = isFromPersona(pill);
            const isToPersona = await lazyIsToPersona.import();
            const isToPill = isToPersona(pill);
            const isCCPill = !!pill.CustomQueryText?.CCKql;

            if (!isFromPill && !isToPill && !isCCPill) {
                // All personas should have at least one pill type, but it is technically possible to have none
                // If this is being hit, we must investigate why
                logUsage('Search_UnknownPeoplePillType', {
                    SearchSessionGuid: searchSessionGuid,
                });
            }

            await addPeopleSuggestionFromPill({
                email: pill.EmailAddresses[0],
                isFromPill: isFromPill,
                isToPill: isToPill,
                isCCPill: isCCPill,
                fromPeople: fromPeople,
                toPeople: toPeople,
                ccPeople: ccPeople,
            });
        }
    }
};

/**
 * Helper function that takes email address from pill, gets the
 * top people suggestion using that as the query, and adds it to the correct
 * collection based on the scope of the search.
 */
const addPeopleSuggestionFromPill = async (params: {
    email: string;
    isFromPill: boolean;
    isToPill: boolean;
    isCCPill: boolean;
    fromPeople: ReadWriteRecipientViewState[];
    toPeople: ReadWriteRecipientViewState[];
    ccPeople: ReadWriteRecipientViewState[];
}) => {
    const { email, isFromPill, isToPill, isCCPill, fromPeople, toPeople, ccPeople } = params;

    const suggestion = await getPeopleSuggestion(email);

    if (isFromPill) {
        const isDuplicate = isDuplicatePeopleSuggestion(fromPeople, suggestion);
        if (!isDuplicate) {
            fromPeople.push(suggestion);
        }
    }

    if (isToPill) {
        const isDuplicate = isDuplicatePeopleSuggestion(toPeople, suggestion);
        if (!isDuplicate) {
            toPeople.push(suggestion);
        }
    }

    if (isCCPill) {
        const isDuplicate = isDuplicatePeopleSuggestion(ccPeople, suggestion);
        if (!isDuplicate) {
            ccPeople.push(suggestion);
        }
    }
};

/**
 * Gets the first people suggestion that matches the query from the user.
 */
const getPeopleSuggestion = async (query: string): Promise<ReadWriteRecipientViewState> => {
    const substrateSuggestionsResponse = await substrateSearchSuggestionsService(
        query,
        getGuid() /* searchSessionGuid */,
        getGuid() /* nextSearchQueryId */,
        'People' /* entityTypes */,
        SubstrateSearchScenario.Mail
    );

    // Suggestion to be used if there's no match (or service error).
    const noResultSuggestion = {
        persona: {
            EmailAddress: {
                EmailAddress: '',
            },
        },
        isExpanding: false,
        isEditing: false,
        isFadedOut: false,
        displayText: query,
        // TODO is this pending, will it ever be added to a viewState, and will we care?
        isPendingResolution: false,
        isValid: false,
        isSelected: false,
        isContextMenuOpen: false,
        expansionStatus: RecipientExpansionStatus.None,
        members: [],
    };

    // If we don't get a response, return default suggestion.
    if (!substrateSuggestionsResponse) {
        return noResultSuggestion;
    }

    try {
        // Get first suggestion from 3S.
        const substrateSuggestionsResponseBody = await substrateSuggestionsResponse.json();
        const suggestionSet = substrateSuggestionsResponseBody.Groups
            ? convertSubstrateSuggestionsResponseToSuggestionSet(substrateSuggestionsResponseBody)
            : {
                  Suggestions: [],
                  TraceId: substrateSuggestionsResponseBody.Instrumentation.TraceId,
                  IsComplete: true,
              };
        const suggestion = suggestionSet.Suggestions[0];

        if (suggestionSet.Suggestions[0]) {
            return {
                persona: {
                    EmailAddress: {
                        EmailAddress: suggestion.EmailAddresses[0],
                    },
                },
                isExpanding: false,
                isEditing: false,
                isFadedOut: false,
                displayText: suggestion.DisplayName,
                // result has been resolved from the backend already
                isPendingResolution: false,
                isValid: true,
                isSelected: false,
                isContextMenuOpen: false,
                expansionStatus: RecipientExpansionStatus.None,
                members: [],
            };
        } else {
            return noResultSuggestion;
        }
    } catch (e) {
        return noResultSuggestion;
    }
};

const convertViewStateToKql = (): string => {
    const { subjectFieldText, keywordsFieldText } = getStore().advancedSearchViewState;
    const kqlPieces: string[] = [];

    kqlPieces.push(convertSubjectTextToKql(subjectFieldText));
    kqlPieces.push(`${keywordsFieldText.trim()}`);

    return kqlPieces.filter((piece: string) => piece).join(' ');
};

export const convertDatesToKql = (
    shouldUseReceivedText: boolean,
    fromDate: OwaDate,
    toDate: OwaDate
): string => {
    const kqlPrefix = shouldUseReceivedText ? 'received' : 'sent';
    const kqlPieces: string[] = [];
    const dateFormat = 'yyyy-MM-dd';

    if (fromDate && toDate) {
        const fromDateString = formatDate(fromDate, dateFormat);
        const toDateString = formatDate(toDate, dateFormat);
        const rangeKql = `${kqlPrefix}:${fromDateString}..${toDateString}`;
        kqlPieces.push(rangeKql);
    } else {
        if (fromDate) {
            const fromKql = kqlPrefix + '>' + formatDate(fromDate, dateFormat);
            kqlPieces.push(fromKql);
        }
        if (toDate) {
            const toKql = kqlPrefix + '<' + formatDate(toDate, dateFormat);
            kqlPieces.push(toKql);
        }
    }

    return kqlPieces.filter((piece: string) => piece).join(' ');
};

export const convertPeopleSuggestionsToKql = (params: {
    suggestions: ReadWriteRecipientViewState[];
    isFromSuggestions: boolean;
}) => {
    const { suggestions, isFromSuggestions } = params;
    const prefix = isFromSuggestions ? 'from:' : 'to:';
    const kqlPieces: string[] = [];

    for (const suggestion of suggestions) {
        kqlPieces.push(`${prefix}${suggestion.persona.EmailAddress.EmailAddress}`);
        kqlPieces.push(`${prefix}"${suggestion.displayText}"`);
    }

    return kqlPieces.join(' ');
};

export const convertSubjectTextToKql = (subjectFieldText: string): string => {
    subjectFieldText = subjectFieldText.trim();
    const prefix = 'subject:';

    if (!subjectFieldText) {
        return '';
    }

    /**
     * Return KQL as prefix + quoted text (without parantheses) if phrase is
     * wrapped in quotes, and there are no other quotes in the text. If we just
     * check first and last index, then the string "joe" "nathan" wouldn't be
     * parsed correctly.
     */
    if (subjectFieldText[0] === '"' && subjectFieldText[subjectFieldText.length - 1] === '"') {
        const subjectWithQuotesStripped = subjectFieldText.substring(
            1,
            subjectFieldText.length - 1
        );
        if (subjectWithQuotesStripped.indexOf('"') === -1) {
            return `${prefix}${subjectFieldText}`;
        }
    }

    return `${prefix}(${subjectFieldText})`;
};

/**
 * Updates the search box with values from the advanced search UI form.
 */
const updateSearchBox = () => {
    // Log delta of advanced search form before search box is updated.
    logAdvancedSearchFormChanges();

    const {
        ccPeopleSuggestions,
        fromDate,
        fromPeopleSuggestions,
        hasAttachments,
        selectedSearchScope,
        toDate,
        toPeopleSuggestions,
    } = getStore().advancedSearchViewState;

    // Clear the search box.
    clearSearchBox(SearchScenarioId.Mail);

    // Update search scope (if it was changed).
    if (selectedSearchScope) {
        setStaticSearchScope(selectedSearchScope);
    }

    // Update "Has attachments" filter value.
    setIncludeAttachments(hasAttachments);

    // Update people pills.
    updatePeoplePills(fromPeopleSuggestions, toPeopleSuggestions, ccPeopleSuggestions);

    // Update search box text.
    var kql = convertViewStateToKql();

    // Some Advanced Search Options do not update the search query text or place a pill. Query text is required
    // to execute a search, so if the date range is the only search option, add it as KQL instead of
    // as a rich filter.
    const { suggestionPills } = getScenarioStore(SearchScenarioId.Mail);
    const hasPills = suggestionPills?.size > 0;
    if (!kql && !hasPills) {
        const selectedSearchScope = getSelectedSearchScope();
        const shouldUseReceivedText = getIsSearchingWithinFromFolder(selectedSearchScope);
        kql = convertDatesToKql(shouldUseReceivedText, fromDate, toDate);
    } else {
        setFromDate(fromDate);
        setToDate(toDate);
    }

    onSearchTextChanged(kql, SearchScenarioId.Mail);
    setSearchTextForSuggestion(kql, SearchScenarioId.Mail);
};

const updatePeoplePills = (
    fromPeopleSuggestions: ReadWriteRecipientViewState[],
    toPeopleSuggestions: ReadWriteRecipientViewState[],
    ccPeopleSuggestions: ReadWriteRecipientViewState[]
) => {
    const processedSuggestions = [];
    const processedSuggestionKeys = [];

    for (const recipientViewState of fromPeopleSuggestions) {
        if (!recipientViewState.isValid) {
            continue;
        }

        const suggestion = convertReadWriteRecipientViewStateToPeopleSuggestion({
            person: recipientViewState,
        });

        suggestion.CustomQueryText.FromKql = createPersonaSearchQueryString(
            suggestion,
            PeopleSearchPrefix.From
        );
        processedSuggestions[suggestion.ReferenceId] = suggestion;
        processedSuggestionKeys.push(suggestion.ReferenceId);
    }

    for (const recipientViewState of ccPeopleSuggestions) {
        if (!recipientViewState.isValid) {
            continue;
        }

        const suggestion = convertReadWriteRecipientViewStateToPeopleSuggestion({
            person: recipientViewState,
        });

        const ccKql = createPersonaSearchQueryString(suggestion, PeopleSearchPrefix.CC);

        /**
         * If we've already processed a suggestion with the same reference ID,
         * then modify the cached suggestion item.
         */
        if (processedSuggestions[suggestion.ReferenceId]) {
            processedSuggestions[suggestion.ReferenceId].CustomQueryText.CCKql = ccKql;
        } else {
            suggestion.CustomQueryText.CCKql = ccKql;
            processedSuggestions[suggestion.ReferenceId] = suggestion;
            processedSuggestionKeys.push(suggestion.ReferenceId);
        }
    }

    for (const recipientViewState of toPeopleSuggestions) {
        if (!recipientViewState.isValid) {
            continue;
        }

        const suggestion = convertReadWriteRecipientViewStateToPeopleSuggestion({
            person: recipientViewState,
        });
        const toKql = createPersonaSearchQueryString(suggestion, PeopleSearchPrefix.To);

        /**
         * If we've already processed a suggestion with the same reference ID,
         * then modify the cached suggestion item.
         */
        if (processedSuggestions[suggestion.ReferenceId]) {
            processedSuggestions[suggestion.ReferenceId].CustomQueryText.ToKql = toKql;
        } else {
            suggestion.CustomQueryText.ToKql = toKql;
            processedSuggestions[suggestion.ReferenceId] = suggestion;
            processedSuggestionKeys.push(suggestion.ReferenceId);
        }
    }

    for (const key of processedSuggestionKeys) {
        const suggestion = processedSuggestions[key];
        addSuggestionPill(suggestion, true /* suggestionSelected */, SearchScenarioId.Mail);
    }
};

/**
 * Compare initial view state of the advanced search form with the end state
 * and log changes.
 */
const logAdvancedSearchFormChanges = () => {
    const { advancedSearchViewState, initialAdvancedSearchViewState } = getStore();
    const exactMatches = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

    const isScopeChanged =
        advancedSearchViewState.selectedSearchScope !==
        initialAdvancedSearchViewState.selectedSearchScope;
    const fromPeopleDelta = getAggregationBucket({
        value:
            advancedSearchViewState.fromPeopleSuggestions.length -
            initialAdvancedSearchViewState.fromPeopleSuggestions.length,
        exactMatches,
    });
    const toPeopleDelta = getAggregationBucket({
        value:
            advancedSearchViewState.toPeopleSuggestions.length -
            initialAdvancedSearchViewState.toPeopleSuggestions.length,
        exactMatches,
    });
    const ccPeopleDelta = getAggregationBucket({
        value:
            advancedSearchViewState.ccPeopleSuggestions.length -
            initialAdvancedSearchViewState.ccPeopleSuggestions.length,
        exactMatches,
    });
    const isSubjectChanged =
        initialAdvancedSearchViewState.subjectFieldText !==
        advancedSearchViewState.subjectFieldText;
    const isKeywordsChanged =
        initialAdvancedSearchViewState.keywordsFieldText !==
        advancedSearchViewState.keywordsFieldText;
    const isFromDatePickerChanged =
        initialAdvancedSearchViewState.fromDate !== advancedSearchViewState.fromDate;
    const isToDatePickerChanged =
        initialAdvancedSearchViewState.toDate !== advancedSearchViewState.toDate;
    const isAttachmentsToggleChanged =
        initialAdvancedSearchViewState.hasAttachments !== advancedSearchViewState.hasAttachments;

    logUsage('Search_AdvancedSearchChanges', [
        isScopeChanged,
        fromPeopleDelta,
        toPeopleDelta,
        isSubjectChanged,
        isKeywordsChanged,
        isFromDatePickerChanged,
        isToDatePickerChanged,
        isAttachmentsToggleChanged,
        ccPeopleDelta,
    ]);
};

/**
 * Converts the ReadWriteRecipientViewState object (from the people picker) to
 * a PeopleSuggestion object for the search box.
 */
const convertReadWriteRecipientViewStateToPeopleSuggestion = (params: {
    person: ReadWriteRecipientViewState;
}): PeopleSuggestion => {
    const { person } = params;

    const displayText = person.displayText;
    const emailAddress = person.persona.EmailAddress.EmailAddress;

    return {
        kind: SuggestionKind.People,
        Attributes: null,
        DisplayName: displayText,
        EmailAddresses: [emailAddress],
        HighlightedDisplayName: displayText,
        ReferenceId: emailAddress,
        Source: 'none',
        CustomQueryText: {
            FromKql: '',
            ToKql: '',
        },
    };
};
