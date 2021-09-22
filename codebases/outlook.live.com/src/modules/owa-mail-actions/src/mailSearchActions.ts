import { action } from 'satcheljs';
import type { SearchTableQuery } from 'owa-mail-list-search';

export let onMailSearchComplete = action(
    'ON_MAIL_SEARCH_COMPLETE',
    (searchTableQuery?: SearchTableQuery) => {
        return {
            searchTableQuery,
        };
    }
);
