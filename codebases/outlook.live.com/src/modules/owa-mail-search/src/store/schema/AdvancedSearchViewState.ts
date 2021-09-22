import type { OwaDate } from 'owa-datetime';
import type { ReadWriteRecipientViewState } from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import type { SearchScope } from 'owa-search-service';

export default interface AdvancedSearchViewState {
    selectedSearchScope: SearchScope; // Current value of the selected folder dropdown
    subjectFieldText: string; // Current value of the subject field
    keywordsFieldText: string; // Current value of the keywords field
    fromDate: OwaDate; // Current value of the "From" date field
    toDate: OwaDate; // Current value of the "To" date field
    hasAttachments: boolean; // Current value of the "Has attachments" checkbox
    fromPeopleSuggestions: ReadWriteRecipientViewState[]; // Current value of "From" people picker.
    toPeopleSuggestions: ReadWriteRecipientViewState[]; // Current value of "To" people picker.
    ccPeopleSuggestions: ReadWriteRecipientViewState[]; // Current value of "CC" people picker.
}

export function getDefaultAdvancedSearchViewState(): AdvancedSearchViewState {
    return {
        selectedSearchScope: null,
        subjectFieldText: '',
        keywordsFieldText: '',
        fromDate: null,
        toDate: null,
        hasAttachments: null,
        fromPeopleSuggestions: [],
        toPeopleSuggestions: [],
        ccPeopleSuggestions: [],
    };
}
