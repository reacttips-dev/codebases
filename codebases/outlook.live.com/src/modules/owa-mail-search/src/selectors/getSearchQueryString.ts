import getIsSearchingWithinFromFolder from './getIsSearchingWithinFromFolder';
import { AND_SEPARATOR, OR_SEPARATOR, PARENTHESIS_FORMAT_STRING, SPACE } from '../searchConstants';
import { PeopleSearchPrefix } from '../store/schema/PeopleSearchPrefix';
import mailSearchStore from '../store/store';
import createCategorySearchQueryString from '../utils/createCategorySearchQueryString';
import createPersonaSearchQueryString from '../utils/createPersonaSearchQueryString';
import createPrivateDistributionListSearchQueryString from '../utils/createPrivateDistributionListSearchQueryString';
import { isFeatureEnabled } from 'owa-feature-flags';
import { format } from 'owa-localize';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { SuggestionKind } from 'owa-search-service';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { ActionSource } from 'owa-mail-store';

export default function getSearchQueryString(filter?: ViewFilter, isUnread?: boolean) {
    const searchStore = getScenarioStore(SearchScenarioId.Mail);

    // Create query strings for suggestion pills.
    const queryStringsForSuggestionPills: string[] = [];
    const toPeoplePillsQueryStringParts: string[] = [];
    const fromPeoplePillsQueryStringParts: string[] = [];
    const ccPeoplePillsQueryStringParts: string[] = [];
    const participantsPeoplePillQueryStringParts: string[] = [];
    const filterQueryStringParts: string[] = [];

    const numberOfPeoplePills = isFeatureEnabled('sea-peopleParticipants')
        ? searchStore.suggestionPillIds.reduce((totalCount: number, currentValue) => {
              if (searchStore.suggestionPills.get(currentValue).kind === SuggestionKind.People) {
                  totalCount++;
              }

              return totalCount;
          }, 0)
        : 0;

    for (let i = 0; i < searchStore.suggestionPillIds.length; i++) {
        const suggestion = searchStore.suggestionPills.get(searchStore.suggestionPillIds[i]);

        switch (suggestion.kind) {
            case SuggestionKind.People:
                if (suggestion.CustomQueryText) {
                    if (suggestion.CustomQueryText.FromKql) {
                        fromPeoplePillsQueryStringParts.push(suggestion.CustomQueryText.FromKql);
                    }

                    if (suggestion.CustomQueryText.ToKql) {
                        toPeoplePillsQueryStringParts.push(suggestion.CustomQueryText.ToKql);
                    }

                    if (suggestion.CustomQueryText.CCKql) {
                        ccPeoplePillsQueryStringParts.push(suggestion.CustomQueryText.CCKql);
                    }
                } else if (numberOfPeoplePills > 1) {
                    participantsPeoplePillQueryStringParts.push(
                        format(
                            PARENTHESIS_FORMAT_STRING,
                            createPersonaSearchQueryString(
                                suggestion,
                                PeopleSearchPrefix.Participants
                            )
                        )
                    );
                } else if (suggestion.QueryText) {
                    queryStringsForSuggestionPills.push(suggestion.QueryText);
                } else if (getIsSearchingWithinFromFolder(mailSearchStore.staticSearchScope)) {
                    fromPeoplePillsQueryStringParts.push(
                        createPersonaSearchQueryString(suggestion, PeopleSearchPrefix.From)
                    );
                } else {
                    toPeoplePillsQueryStringParts.push(
                        createPersonaSearchQueryString(suggestion, PeopleSearchPrefix.To)
                    );
                }
                break;

            case SuggestionKind.PrivateDistributionList:
                fromPeoplePillsQueryStringParts.push(
                    createPrivateDistributionListSearchQueryString(
                        suggestion,
                        mailSearchStore.staticSearchScope
                    )
                );
                break;

            case SuggestionKind.Category:
                queryStringsForSuggestionPills.push(createCategorySearchQueryString(suggestion));
                break;
        }
    }

    /**
     * To create KQL that makes sense with FROM and TO expressions for people
     * pills, we OR the parts within each expression, and AND the FROM and TO
     * expressions together.
     */
    const peoplePillsQueryStringParts: string[] = [];
    if (toPeoplePillsQueryStringParts.length > 0) {
        peoplePillsQueryStringParts.push(`(${toPeoplePillsQueryStringParts.join(OR_SEPARATOR)})`);
    }
    if (fromPeoplePillsQueryStringParts.length > 0) {
        peoplePillsQueryStringParts.push(`(${fromPeoplePillsQueryStringParts.join(OR_SEPARATOR)})`);
    }
    if (ccPeoplePillsQueryStringParts.length > 0) {
        peoplePillsQueryStringParts.push(`(${ccPeoplePillsQueryStringParts.join(OR_SEPARATOR)})`);
    }
    if (participantsPeoplePillQueryStringParts.length > 0) {
        peoplePillsQueryStringParts.push(
            `(${participantsPeoplePillQueryStringParts.join(AND_SEPARATOR)})`
        );
    }

    // Only add people pill parts if any exist.
    if (peoplePillsQueryStringParts.length > 0) {
        queryStringsForSuggestionPills.push(peoplePillsQueryStringParts.join(AND_SEPARATOR));
    }

    if (filter) {
        switch (filter) {
            case 'Unread':
                filterQueryStringParts.push('isread:no');
                break;
            case 'Flagged':
                filterQueryStringParts.push('isflagged:yes');
                break;
            case 'HasAttachment':
                filterQueryStringParts.push('hasAttachment:yes');
                break;
            case 'Mentioned':
                filterQueryStringParts.push('ismentioned:yes');
                break;
            case 'ToOrCcMe':
                addToMeToQuery(filterQueryStringParts);
                break;
            default:
                break;
        }
    }

    if (mailSearchStore.isUnread) {
        filterQueryStringParts.push('isread:no');
    }

    if (mailSearchStore.isFlagged) {
        filterQueryStringParts.push('isflagged:yes');
    }

    if (mailSearchStore.isMentioned) {
        filterQueryStringParts.push('ismentioned:yes');
    }

    if (mailSearchStore.isToMe) {
        addToMeToQuery(filterQueryStringParts);
    }

    // Join pill queries into a single query (OR'ed).
    let combinedQueryStringForSearchPills = '';
    if (queryStringsForSuggestionPills.length > 0) {
        combinedQueryStringForSearchPills = queryStringsForSuggestionPills.join(OR_SEPARATOR);
    }

    // If filter(s) is applied, AND it with the entire rest of the query
    if (filterQueryStringParts.length > 0) {
        if (combinedQueryStringForSearchPills) {
            filterQueryStringParts.unshift(combinedQueryStringForSearchPills);
        }
        combinedQueryStringForSearchPills = filterQueryStringParts.join(AND_SEPARATOR);
    }

    const searchText =
        (searchStore.queryActionSource as ActionSource) === 'QueryAlterationSuggestionLink' &&
        searchStore.alterationDisplayText &&
        searchStore.alteredQuery
            ? searchStore.alteredQuery
            : searchStore.searchText;

    // Join pills query string with the search keyword query string.
    const queryString = [combinedQueryStringForSearchPills, searchText]
        // Remove extra whitespace from parts.
        .map((query: string) => query && query.trim())
        // Remove any null or empty parts.
        .filter((query: string) => query.length > 0)
        // Concatenate parts with spaces in between.
        .join(SPACE);

    // Return KQL.
    return queryString;
}

function addToMeToQuery(filterQueryStringParts: string[]) {
    const userEmailAddress = getUserConfiguration().SessionSettings.UserEmailAddress;
    filterQueryStringParts.push('to:(' + userEmailAddress + ')');
}
