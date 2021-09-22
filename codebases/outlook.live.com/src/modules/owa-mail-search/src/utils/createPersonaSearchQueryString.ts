import type { PeopleSuggestion } from 'owa-search-service';
import { OR_SEPARATOR } from '../searchConstants';
import { createFormattedStringWithPrefix } from './searchQueryStringHelper';
import type { PeopleSearchPrefix } from '../store/schema/PeopleSearchPrefix';

export default function createPersonaSearchQueryString(
    personaSuggestion: PeopleSuggestion,
    peopleSearchPrefix: PeopleSearchPrefix
): string {
    const singlePersonaQueries: string[] = [];
    let isDisplayNameValid: boolean = true;

    if (personaSuggestion.DisplayName !== null) {
        /**
         * Ensure DisplayName doesn't contain "<" or ">".
         *
         * This is specific to the case in which an external email address
         * gets added to the search box via the advanced search UI. If the
         * DisplayName gets sent as-is, the service does not return any
         * results. Given the low usage of this very specific scenario, we'll
         * choose to just rely on the user SMTP instead of trying to scrub
         * the DisplayName client-side.
         */
        isDisplayNameValid =
            personaSuggestion.DisplayName.indexOf('<') === -1 &&
            personaSuggestion.DisplayName.indexOf('>') === -1;

        if (isDisplayNameValid) {
            singlePersonaQueries.push(
                createFormattedStringWithPrefix(personaSuggestion.DisplayName, peopleSearchPrefix)
            );
        }
    }

    if (personaSuggestion.EmailAddresses !== null) {
        personaSuggestion.EmailAddresses.forEach((email: string) => {
            if (
                (email !== personaSuggestion.DisplayName && isDisplayNameValid) ||
                !isDisplayNameValid
            ) {
                singlePersonaQueries.push(
                    createFormattedStringWithPrefix(email, peopleSearchPrefix)
                );
            }
        });
    }

    // Joining all the queries with an OR
    return singlePersonaQueries.join(OR_SEPARATOR);
}
