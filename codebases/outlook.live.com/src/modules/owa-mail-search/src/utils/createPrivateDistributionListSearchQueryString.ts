import type { SearchScope, PrivateDistributionListSuggestion } from 'owa-search-service';
import { OR_SEPARATOR } from '../searchConstants';
import { createFormattedStringWithPrefix } from './searchQueryStringHelper';
import getIsSearchingWithinFromFolder from '../selectors/getIsSearchingWithinFromFolder';
import { PeopleSearchPrefix } from '../store/schema/PeopleSearchPrefix';

export default function createPrivateDistributionListSearchQueryString(
    pdlSuggestion: PrivateDistributionListSuggestion,
    searchScope: SearchScope
): string {
    if (pdlSuggestion.QueryText) {
        return pdlSuggestion.QueryText;
    }

    const fromFolder = getIsSearchingWithinFromFolder(searchScope)
        ? PeopleSearchPrefix.From
        : PeopleSearchPrefix.To;

    const singlePersonaQueries: string[] = [];

    pdlSuggestion.Members.forEach(member => {
        if (member.name !== null) {
            singlePersonaQueries.push(createFormattedStringWithPrefix(member.name, fromFolder));
        }

        if (member.emailAddress !== null && member.emailAddress !== member.name) {
            singlePersonaQueries.push(
                createFormattedStringWithPrefix(member.emailAddress, fromFolder)
            );
        }
    });

    // Joining all the queries with an OR
    return singlePersonaQueries.join(OR_SEPARATOR);
}
