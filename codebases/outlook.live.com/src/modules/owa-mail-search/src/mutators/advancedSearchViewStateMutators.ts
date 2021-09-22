import { getDefaultAdvancedSearchViewState } from '../store/schema/AdvancedSearchViewState';
import { getStore } from '../store/store';
import isDuplicatePeopleSuggestion from '../utils/isDuplicatePeopleSuggestion';
import getDefaultMailBoxScope from '../utils/getDefaultMailBoxScope';
import { owaDate } from 'owa-datetime';
import type { ReadWriteRecipientViewState } from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { searchSessionEnded } from 'owa-search-actions';
import { getUserConfiguration } from 'owa-session-store';
import { mutator } from 'satcheljs';
import {
    onFolderDropdownOptionSelected,
    onAdvancedSearchMounted,
    onSubjectFieldChanged,
    onKeywordsFieldChanged,
    onFromDateChanged,
    onToDateChanged,
    onHasAttachmentsCheckboxChanged,
    onClearFiltersButtonClicked,
    onAdvancedSearchPeoplePickersInitialized,
    addPersonsAdvancedSearch,
    removePersonAdvancedSearch,
    editPersonsAdvancedSearch,
    onAdvancedSearchUiDismissed,
} from '../actions/internalActions';
import { PeopleSearchPrefix } from '../store/schema/PeopleSearchPrefix';
import { clearSearchScope } from '../actions/publicActions';
import getSearchQueryHasAttachmentsKqlMatches from '../utils/getSearchQueryHasAttachmentsKqlMatches';

mutator(onAdvancedSearchMounted, () => {
    const { searchText: searchBoxText } = getScenarioStore(SearchScenarioId.Mail);
    const parsedPieces: string[] = []; // Pieces of the search box text that were parsed.

    initializeSubjectField(searchBoxText, parsedPieces);
    initializeDatePickers(searchBoxText, parsedPieces);
    initializeHasAttachmentsCheckbox(searchBoxText, parsedPieces);
    initializePeoplePickers(searchBoxText, parsedPieces);

    /**
     * Must initialize this last as it relies on parsedPieces being populated
     * by other functions.
     */
    initializeKeywordsField(searchBoxText, parsedPieces);
});

mutator(searchSessionEnded, () => {
    getStore().advancedSearchViewState = getDefaultAdvancedSearchViewState();
});

mutator(onAdvancedSearchUiDismissed, () => {
    getStore().advancedSearchViewState = getDefaultAdvancedSearchViewState();
});

mutator(onFolderDropdownOptionSelected, actionMessage => {
    getStore().advancedSearchViewState.selectedSearchScope =
        actionMessage.selectedScopeOption.searchScope;
});

mutator(clearSearchScope, actionMessage => {
    getStore().advancedSearchViewState.selectedSearchScope = getDefaultMailBoxScope(
        actionMessage.searchScopeKind
    );
});

export const onSubjectFieldChangedMutator = mutator(onSubjectFieldChanged, actionMessage => {
    getStore().advancedSearchViewState.subjectFieldText = actionMessage.value;
});

export const onKeywordsFieldChangedMutator = mutator(onKeywordsFieldChanged, actionMessage => {
    getStore().advancedSearchViewState.keywordsFieldText = actionMessage.value;
});

mutator(onFromDateChanged, actionMessage => {
    getStore().advancedSearchViewState.fromDate = actionMessage.value;
});

mutator(onToDateChanged, actionMessage => {
    getStore().advancedSearchViewState.toDate = actionMessage.value;
});

mutator(onHasAttachmentsCheckboxChanged, actionMessage => {
    getStore().advancedSearchViewState.hasAttachments = actionMessage.value;
});

mutator(onClearFiltersButtonClicked, () => {
    getStore().advancedSearchViewState = getDefaultAdvancedSearchViewState();
    getStore().advancedSearchViewState.selectedSearchScope = getStore().initialSearchScope;
});

mutator(onAdvancedSearchPeoplePickersInitialized, actionMessage => {
    getStore().initialAdvancedSearchViewState.fromPeopleSuggestions =
        actionMessage.fromPickerValues;
    getStore().initialAdvancedSearchViewState.toPeopleSuggestions = actionMessage.toPickerValues;
    getStore().initialAdvancedSearchViewState.ccPeopleSuggestions = actionMessage.ccPickerValues;

    getStore().advancedSearchViewState.fromPeopleSuggestions = actionMessage.fromPickerValues;
    getStore().advancedSearchViewState.toPeopleSuggestions = actionMessage.toPickerValues;
    getStore().advancedSearchViewState.ccPeopleSuggestions = actionMessage.ccPickerValues;
});

mutator(addPersonsAdvancedSearch, actionMessage => {
    const { personsToAdd, peopleSearchPrefix } = actionMessage;
    const {
        fromPeopleSuggestions,
        toPeopleSuggestions,
        ccPeopleSuggestions,
    } = getStore().advancedSearchViewState;

    const suggestions = (() => {
        if (peopleSearchPrefix == PeopleSearchPrefix.From) {
            return fromPeopleSuggestions;
        } else if (peopleSearchPrefix == PeopleSearchPrefix.To) {
            return toPeopleSuggestions;
        } else if (peopleSearchPrefix == PeopleSearchPrefix.CC) {
            return ccPeopleSuggestions;
        } else {
            throw new Error('Invalid PeopleSearchPrefix value');
        }
    })();

    for (const personToAdd of personsToAdd) {
        // Don't add person to list if they're already in it.
        const isDuplicate = isDuplicatePeopleSuggestion(suggestions, personToAdd);
        if (!isDuplicate) {
            suggestions.push(personToAdd);
        }
    }
});

mutator(removePersonAdvancedSearch, actionMessage => {
    const { personToRemove, peopleSearchPrefix } = actionMessage;

    let suggestions = (() => {
        if (peopleSearchPrefix == PeopleSearchPrefix.From) {
            return getStore().advancedSearchViewState.fromPeopleSuggestions;
        } else if (peopleSearchPrefix == PeopleSearchPrefix.To) {
            return getStore().advancedSearchViewState.toPeopleSuggestions;
        } else if (peopleSearchPrefix == PeopleSearchPrefix.CC) {
            return getStore().advancedSearchViewState.ccPeopleSuggestions;
        } else {
            return [];
        }
    })();

    const persons = suggestions.filter((existingSuggestion: ReadWriteRecipientViewState) => {
        return (
            existingSuggestion.persona.EmailAddress.EmailAddress !==
            personToRemove.persona.EmailAddress.EmailAddress
        );
    });

    if (peopleSearchPrefix == PeopleSearchPrefix.From) {
        getStore().advancedSearchViewState.fromPeopleSuggestions = persons;
    } else if (peopleSearchPrefix == PeopleSearchPrefix.To) {
        getStore().advancedSearchViewState.toPeopleSuggestions = persons;
    } else if (peopleSearchPrefix == PeopleSearchPrefix.CC) {
        getStore().advancedSearchViewState.ccPeopleSuggestions = persons;
    }
});

mutator(editPersonsAdvancedSearch, actionMessage => {
    const { oldPerson, newPerson } = actionMessage;

    oldPerson.persona = newPerson.persona;
    oldPerson.displayText = newPerson.displayText;
    oldPerson.isValid = newPerson.isValid;
    oldPerson.isEditing = false;
});

/**
 * Helper function to encapsulate logic for parsing subject KQL from the
 * search box text.
 */
export function initializeSubjectField(searchBoxText: string, parsedPieces: string[]) {
    // Last index of a subject KQL.
    let lastSubjectIndex = -1;

    const SUBJECT_REGEX_WITH_QUOTES = /subject:"([^"]+)"/g;
    const subjectWithQuotesMatches = searchBoxText.match(SUBJECT_REGEX_WITH_QUOTES);
    if (subjectWithQuotesMatches) {
        for (const match of subjectWithQuotesMatches) {
            // Get index of the match.
            const index = searchBoxText.indexOf(match);

            if (index > lastSubjectIndex) {
                lastSubjectIndex = index;
                const subject = match.substring(8 /* subject: */, match.length);

                getStore().initialAdvancedSearchViewState.subjectFieldText = subject;
                getStore().advancedSearchViewState.subjectFieldText = subject;
            }

            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);

            /**
             * Remove parsed piece from search box text so the next regular
             * expression doesn't also match on this piece, resulting in that
             * piece being processed twice.
             */
            searchBoxText = searchBoxText.replace(match, '');
        }
    }

    const SUBJECT_REGEX_WITH_PARANS = /subject:(\([^)]*\))/g;
    const subjectWithParansMatches = searchBoxText.match(SUBJECT_REGEX_WITH_PARANS);
    if (subjectWithParansMatches) {
        for (const match of subjectWithParansMatches) {
            // Get index of the match.
            const index = searchBoxText.indexOf(match);

            if (index > lastSubjectIndex) {
                lastSubjectIndex = index;
                const subject = match.substring(9 /* subject:( */, match.length - 1);

                getStore().initialAdvancedSearchViewState.subjectFieldText = subject;
                getStore().advancedSearchViewState.subjectFieldText = subject;
            }

            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);

            /**
             * Remove parsed piece from search box text so the next regular
             * expression doesn't also match on this piece, resulting in that
             * piece being processed twice.
             */
            searchBoxText = searchBoxText.replace(match, '');
        }
    }

    const SUBJECT_NO_QUOTES_REGEX = /subject:([^ ]+)/g;
    const subjectNoQuotesMatches = searchBoxText.match(SUBJECT_NO_QUOTES_REGEX);
    if (subjectNoQuotesMatches) {
        for (const match of subjectNoQuotesMatches) {
            // Get index of the match.
            const index = searchBoxText.indexOf(match);

            if (index > lastSubjectIndex) {
                lastSubjectIndex = index;
                const subject = match.substring(8 /* subject: */, match.length);

                getStore().initialAdvancedSearchViewState.subjectFieldText = subject;
                getStore().advancedSearchViewState.subjectFieldText = subject;
            }

            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);
        }
    }
}

/**
 * Helper function to encapsulate logic for parsing date-specific KQL from the
 * search box text.
 */
export function initializeDatePickers(searchBoxText: string, parsedPieces: string[]) {
    let { fromDate, toDate } = getStore().advancedSearchViewState;
    let onDate = null;

    // Last index of "received>=", "received>", "sent>=", or "sent>".
    let lastFromDateIndex = -1;

    // Last index of "received<=", "received<", "sent<=", or "sent<".
    let lastToDateIndex = -1;

    // Last index of "received=" or "sent=".
    let lastOnDateIndex = -1;

    const { UserOptions } = getUserConfiguration();
    const timeZone = UserOptions?.TimeZone;

    // Look for this pattern since it's the KQL we convert the date pickers to.
    const RECEIVED_KQL_REGEX = /\(received>=.*received<=.*\)/g;
    const receivedMatches = searchBoxText.match(RECEIVED_KQL_REGEX);
    if (receivedMatches) {
        for (const match of receivedMatches) {
            parsedPieces.push(match);
        }
    }

    // Look for this pattern since it's the KQL we convert the date pickers to.
    const SENT_KQL_REGEX = /\(sent>=.*sent<=.*\)/g;
    const sentMatches = searchBoxText.match(SENT_KQL_REGEX);
    if (sentMatches) {
        for (const match of sentMatches) {
            parsedPieces.push(match);
        }
    }

    // Parse "from date" (received inclusive) KQL from search text.
    const FROM_DATE_INCLUSIVE_RECEIVED_PREFIX = 'received>=';
    const FROM_DATE_INCLUSIVE_RECEIVED_REGEX = /received>=\d{4}-\d{2}-\d{2}/g;
    const fromDateInclusiveReceivedMatches = searchBoxText.match(
        FROM_DATE_INCLUSIVE_RECEIVED_REGEX
    );
    if (fromDateInclusiveReceivedMatches) {
        for (const match of fromDateInclusiveReceivedMatches) {
            // Get index of the match.
            const index = searchBoxText.indexOf(match);

            /**
             * If the index of this match exists later in the string than the
             * most recent match recorded, update the "latest" index and also
             * save the date of this match.
             */
            if (index > lastFromDateIndex) {
                const date = match.split(FROM_DATE_INCLUSIVE_RECEIVED_PREFIX)[1];
                fromDate = owaDate(timeZone, date);

                lastFromDateIndex = index;
            }

            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);
        }
    }

    // Parse "from date" (received) KQL from search text.
    const FROM_DATE_RECEIVED_PREFIX = 'received>';
    const FROM_DATE_RECEIVED_REGEX = /received>\d{4}-\d{2}-\d{2}/g;
    const fromDateReceivedMatches = searchBoxText.match(FROM_DATE_RECEIVED_REGEX);
    if (fromDateReceivedMatches) {
        for (const match of fromDateReceivedMatches) {
            // Get index of the match.
            const index = searchBoxText.indexOf(match);

            /**
             * If the index of this match exists later in the string than the
             * most recent match recorded, update the "latest" index and also
             * save the date of this match.
             */
            if (index > lastFromDateIndex) {
                const date = match.split(FROM_DATE_RECEIVED_PREFIX)[1];
                fromDate = owaDate(timeZone, date);

                lastFromDateIndex = index;
            }

            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);
        }
    }

    // Parse "from date" (sent inclusive) KQL from search text.
    const FROM_DATE_INCLUSIVE_SENT_PREFIX = 'sent>=';
    const FROM_DATE_INCLUSIVE_SENT_REGEX = /sent>=\d{4}-\d{2}-\d{2}/g;
    const fromDateInclusiveSentMatches = searchBoxText.match(FROM_DATE_INCLUSIVE_SENT_REGEX);
    if (fromDateInclusiveSentMatches) {
        for (const match of fromDateInclusiveSentMatches) {
            // Get index of the match.
            const index = searchBoxText.indexOf(match);

            /**
             * If the index of this match exists later in the string than the
             * most recent match recorded, update the "latest" index and also
             * save the date of this match.
             */
            if (index > lastFromDateIndex) {
                const date = match.split(FROM_DATE_INCLUSIVE_SENT_PREFIX)[1];
                fromDate = owaDate(timeZone, date);

                lastFromDateIndex = index;
            }

            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);
        }
    }

    // Parse "from date" (sent) KQL from search text.
    const FROM_DATE_SENT_PREFIX = 'sent>';
    const FROM_DATE_SENT_REGEX = /sent>\d{4}-\d{2}-\d{2}/g;
    const fromDateSentMatches = searchBoxText.match(FROM_DATE_SENT_REGEX);
    if (fromDateSentMatches) {
        for (const match of fromDateSentMatches) {
            // Get index of the match.
            const index = searchBoxText.indexOf(match);

            /**
             * If the index of this match exists later in the string than the
             * most recent match recorded, update the "latest" index and also
             * save the date of this match.
             */
            if (index > lastFromDateIndex) {
                const date = match.split(FROM_DATE_SENT_PREFIX)[1];
                fromDate = owaDate(timeZone, date);

                lastFromDateIndex = index;
            }

            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);
        }
    }

    // Parse "to date" (received inclusive) KQL from search text.
    const TO_DATE_INCLUSIVE_RECEIVED_PREFIX = 'received<=';
    const TO_DATE_INCLUSIVE_RECEIVED_REGEX = /received<=\d{4}-\d{2}-\d{2}/g;
    const toDateInclusiveReceivedMatches = searchBoxText.match(TO_DATE_INCLUSIVE_RECEIVED_REGEX);
    if (toDateInclusiveReceivedMatches) {
        for (const match of toDateInclusiveReceivedMatches) {
            // Get index of the match.
            const index = searchBoxText.indexOf(match);

            /**
             * If the index of this match exists later in the string than the
             * most recent match recorded, update the "latest" index and also
             * save the date of this match.
             */
            if (index > lastToDateIndex) {
                const date = match.split(TO_DATE_INCLUSIVE_RECEIVED_PREFIX)[1];
                toDate = owaDate(timeZone, date);

                lastToDateIndex = index;
            }

            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);
        }
    }

    // Parse "to date" (received) KQL from search text.
    const TO_DATE_RECEIVED_PREFIX = 'received<';
    const TO_DATE_RECEIVED_REGEX = /received<\d{4}-\d{2}-\d{2}/g;
    const toDateReceivedMatches = searchBoxText.match(TO_DATE_RECEIVED_REGEX);
    if (toDateReceivedMatches) {
        for (const match of toDateReceivedMatches) {
            // Get index of the match.
            const index = searchBoxText.indexOf(match);

            /**
             * If the index of this match exists later in the string than the
             * most recent match recorded, update the "latest" index and also
             * save the date of this match.
             */
            if (index > lastToDateIndex) {
                const date = match.split(TO_DATE_RECEIVED_PREFIX)[1];
                toDate = owaDate(timeZone, date);

                lastToDateIndex = index;
            }

            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);
        }
    }

    // Parse "to date" (sent inclusive) KQL from search text.
    const TO_DATE_INCLUSIVE_SENT_PREFIX = 'sent<=';
    const TO_DATE_INCLUSIVE_SENT_REGEX = /sent<=\d{4}-\d{2}-\d{2}/g;
    const toDateInclusiveSentMatches = searchBoxText.match(TO_DATE_INCLUSIVE_SENT_REGEX);
    if (toDateInclusiveSentMatches) {
        for (const match of toDateInclusiveSentMatches) {
            // Get index of the match.
            const index = searchBoxText.indexOf(match);

            /**
             * If the index of this match exists later in the string than the
             * most recent match recorded, update the "latest" index and also
             * save the date of this match.
             */
            if (index > lastToDateIndex) {
                const date = match.split(TO_DATE_INCLUSIVE_SENT_PREFIX)[1];
                toDate = owaDate(timeZone, date);

                lastToDateIndex = index;
            }

            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);
        }
    }

    // Parse "to date" (sent) KQL from search text.
    const TO_DATE_SENT_PREFIX = 'sent<';
    const TO_DATE_SENT_REGEX = /sent<\d{4}-\d{2}-\d{2}/g;
    const toDateSentMatches = searchBoxText.match(TO_DATE_SENT_REGEX);
    if (toDateSentMatches) {
        for (const match of toDateSentMatches) {
            // Get index of the match.
            const index = searchBoxText.indexOf(match);

            /**
             * If the index of this match exists later in the string than the
             * most recent match recorded, update the "latest" index and also
             * save the date of this match.
             */
            if (index > lastToDateIndex) {
                const date = match.split(TO_DATE_SENT_PREFIX)[1];
                toDate = owaDate(timeZone, date);

                lastToDateIndex = index;
            }

            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);
        }
    }

    // Parse "on date" (received) KQL from search text.
    const ON_DATE_RECEIVED_PREFIX = 'received=';
    const ON_DATE_RECEIVED_REGEX = /received=\d{4}-\d{2}-\d{2}/g;
    const onDateReceivedMatches = searchBoxText.match(ON_DATE_RECEIVED_REGEX);
    if (onDateReceivedMatches) {
        for (const match of onDateReceivedMatches) {
            // Get index of the match.
            const index = searchBoxText.indexOf(match);

            /**
             * If the index of this match exists later in the string than the
             * most recent match recorded, update the "latest" index and also
             * save the date of this match.
             */
            if (index > lastOnDateIndex) {
                const date = match.split(ON_DATE_RECEIVED_PREFIX)[1];
                onDate = owaDate(timeZone, date);

                lastOnDateIndex = index;
            }

            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);
        }
    }

    // Parse "on date" (sent) KQL from search text.
    const ON_DATE_SENT_PREFIX = 'sent=';
    const ON_DATE_SENT_REGEX = /sent=\d{4}-\d{2}-\d{2}/g;
    const onDateSentMatches = searchBoxText.match(ON_DATE_SENT_REGEX);
    if (onDateSentMatches) {
        for (const match of onDateSentMatches) {
            // Get index of the match.
            const index = searchBoxText.indexOf(match);

            /**
             * If the index of this match exists later in the string than the
             * most recent match recorded, update the "latest" index and also
             * save the date of this match.
             */
            if (index > lastOnDateIndex) {
                const date = match.split(ON_DATE_SENT_PREFIX)[1];
                onDate = owaDate(timeZone, date);

                lastOnDateIndex = index;
            }

            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);
        }
    }

    const RANGE_DATE_SEPARATOR = '..';

    // Parse "date range" (received) KQL from search text.
    const RANGE_DATE_RECEIVED_PREFIX = 'received:';
    const RANGE_DATE_RECEIVED_REGEX = /received:\d{4}-\d{2}-\d{2}\.\.\d{4}-\d{2}-\d{2}/g;
    const rangeDateReceivedMatches = searchBoxText.match(RANGE_DATE_RECEIVED_REGEX);
    if (rangeDateReceivedMatches) {
        for (const match of rangeDateReceivedMatches) {
            // Get index of the match.
            const index = searchBoxText.indexOf(match);

            /**
             * If the index of this match exists later in the string than the
             * most recent match recorded, update the "latest" index and also
             * save the dates of this match.
             */
            if (index > lastToDateIndex || index > lastFromDateIndex) {
                const dateRange = match.split(RANGE_DATE_RECEIVED_PREFIX)[1];
                const dates = dateRange.split(RANGE_DATE_SEPARATOR);

                fromDate = owaDate(timeZone, dates[0]);
                toDate = owaDate(timeZone, dates[1]);

                lastToDateIndex = index;
                lastFromDateIndex = index;
            }

            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);
        }
    }

    // Parse "date range" (sent) KQL from search text.
    const RANGE_DATE_SENT_PREFIX = 'sent:';
    const RANGE_DATE_SENT_REGEX = /sent:\d{4}-\d{2}-\d{2}\.\.\d{4}-\d{2}-\d{2}/g;
    const rangeDateSentMatches = searchBoxText.match(RANGE_DATE_SENT_REGEX);
    if (rangeDateSentMatches) {
        for (const match of rangeDateSentMatches) {
            // Get index of the match.
            const index = searchBoxText.indexOf(match);

            /**
             * If the index of this match exists later in the string than the
             * most recent match recorded, update the "latest" index and also
             * save the dates of this match.
             */
            if (index > lastToDateIndex || index > lastFromDateIndex) {
                const dateRange = match.split(RANGE_DATE_SENT_PREFIX)[1];
                const dates = dateRange.split(RANGE_DATE_SEPARATOR);

                fromDate = owaDate(timeZone, dates[0]);
                toDate = owaDate(timeZone, dates[1]);

                lastToDateIndex = index;
                lastFromDateIndex = index;
            }

            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);
        }
    }

    /**
     * If KQL for looking for emails on a specific date (i.e. onDate) was set (and
     * it was typed in AFTER a before/after date), use that. This follows the
     * principle that we should use whatever the user, theoretically, typed in
     * last into the search box.
     */
    if (lastOnDateIndex > Math.max(lastFromDateIndex, lastToDateIndex)) {
        fromDate = onDate;
        toDate = onDate;
    }

    /**
     * Check already applied filters to see if user has any dates selected. If
     * there are any existing values, then these values take precedence over
     * any KQL in the search box.
     */
    const { fromDate: appliedFromDate, toDate: appliedToDate } = getStore();
    if (appliedFromDate) {
        fromDate = appliedFromDate;
    }
    if (appliedToDate) {
        toDate = appliedToDate;
    }

    // Swap the dates if they're out of order (and both exist).
    if (toDate && fromDate && toDate < fromDate) {
        const temp = toDate;
        toDate = fromDate;
        fromDate = temp;
    }

    // Update store with parsed values.
    getStore().advancedSearchViewState.fromDate = fromDate;
    getStore().advancedSearchViewState.toDate = toDate;
}

/**
 * Helper function to encapsulate logic for initializing "Keywords" field.
 */
export function initializeKeywordsField(searchBoxText: string, parsedPieces: string[]) {
    // Remove any matches and set remaining text to "Keywords" field.
    let leftoverSearchBoxText = searchBoxText;
    for (const parsedPiece of parsedPieces) {
        leftoverSearchBoxText = leftoverSearchBoxText.replace(parsedPiece, '');
    }

    getStore().initialAdvancedSearchViewState.keywordsFieldText = leftoverSearchBoxText.trim();
    getStore().advancedSearchViewState.keywordsFieldText = leftoverSearchBoxText.trim();
}

/**
 * Helper function to encapsulate logic for initializing "Has attachments" checkbox.
 */
export function initializeHasAttachmentsCheckbox(searchBoxText: string, parsedPieces: string[]) {
    const hasAttachmentsMatches = getSearchQueryHasAttachmentsKqlMatches(searchBoxText);
    if (hasAttachmentsMatches) {
        for (const match of hasAttachmentsMatches) {
            const value = match.substring(15 /* hasattachments: */).toLocaleLowerCase();
            getStore().advancedSearchViewState.hasAttachments = value === 'yes' || value === 'true';

            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);
        }
    }

    /**
     * Check if user has applied a search filter value for this (which takes
     * precedence over KQL).
     */
    const hasAttachmentsFilter = getStore().includeAttachments;
    if (hasAttachmentsFilter) {
        getStore().advancedSearchViewState.hasAttachments = hasAttachmentsFilter;
    }
}

/**
 * Helper function to add people KQL parts to parsed pieces so they are counted
 * as processed.
 */
export function initializePeoplePickers(searchBoxText: string, parsedPieces: string[]) {
    const FROM_WITH_QUOTES_REGEX = /from:"([^"]+)"/g;
    const fromWithQuotesMatches = searchBoxText.match(FROM_WITH_QUOTES_REGEX);
    if (fromWithQuotesMatches) {
        for (const match of fromWithQuotesMatches) {
            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);

            /**
             * Remove parsed piece from search box text so the next regular
             * expression doesn't also match on this piece, resulting in that
             * piece being processed twice.
             */
            searchBoxText = searchBoxText.replace(match, '');
        }
    }

    const FROM_WITHOUT_QUOTES_REGEX = /from:([^ ]+)/g;
    const fromWithoutQuotesMatches = searchBoxText.match(FROM_WITHOUT_QUOTES_REGEX);
    if (fromWithoutQuotesMatches) {
        for (const match of fromWithoutQuotesMatches) {
            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);
        }
    }

    const TO_WITH_QUOTES_REGEX = /to:"([^"]+)"/g;
    const toWithQuotesMatches = searchBoxText.match(TO_WITH_QUOTES_REGEX);
    if (toWithQuotesMatches) {
        for (const match of toWithQuotesMatches) {
            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);

            /**
             * Remove parsed piece from search box text so the next regular
             * expression doesn't also match on this piece, resulting in that
             * piece being processed twice.
             */
            searchBoxText = searchBoxText.replace(match, '');
        }
    }

    const TO_WITHOUT_QUOTES_REGEX = /to:([^ ]+)/g;
    const toWithoutQuotesMatches = searchBoxText.match(TO_WITHOUT_QUOTES_REGEX);
    if (toWithoutQuotesMatches) {
        for (const match of toWithoutQuotesMatches) {
            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);
        }
    }

    const CC_WITH_QUOTES_REGEX = /cc:"([^"]+)"/g;
    const ccWithQuotesMatches = searchBoxText.match(CC_WITH_QUOTES_REGEX);
    if (ccWithQuotesMatches) {
        for (const match of ccWithQuotesMatches) {
            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);

            /**
             * Remove parsed piece from search box text so the next regular
             * expression doesn't also match on this piece, resulting in that
             * piece being processed twice.
             */
            searchBoxText = searchBoxText.replace(match, '');
        }
    }

    const CC_WITHOUT_QUOTES_REGEX = /cc:([^ ]+)/g;
    const ccWithoutQuotesMatches = searchBoxText.match(CC_WITHOUT_QUOTES_REGEX);
    if (ccWithoutQuotesMatches) {
        for (const match of ccWithoutQuotesMatches) {
            // Push match into parsedPieces so we know later that we've processed it.
            parsedPieces.push(match);
        }
    }
}
