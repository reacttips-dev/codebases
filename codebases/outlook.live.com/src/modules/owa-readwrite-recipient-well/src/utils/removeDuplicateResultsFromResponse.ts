import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import type { SubstrateSearchSuggestionsResponse } from 'owa-search-service';
import type FindPeopleResponseMessage from 'owa-service/lib/contract/FindPeopleResponseMessage';
import shouldUse3SPeopleSuggestions from 'owa-recipient-suggestions/lib/util/shouldUse3SPeopleSuggestions';

export default function removeDuplicateResultsFromResponseAndUpdateRefId(
    currentEmailAddresses: Map<string, FindRecipientPersonaType>,
    serverResult: FindPeopleResponseMessage | SubstrateSearchSuggestionsResponse,
    resultList: FindRecipientPersonaType[],
    updateRefIds?: boolean
): void {
    if (serverResult) {
        if (shouldUse3SPeopleSuggestions()) {
            removeDuplicate3SResultsAndUpdateRefId(
                currentEmailAddresses,
                serverResult as SubstrateSearchSuggestionsResponse,
                resultList,
                updateRefIds
            );
        } else {
            removeDuplicateFindPeopleResults(
                currentEmailAddresses,
                serverResult as FindPeopleResponseMessage
            );
        }
    }
}

function removeDuplicate3SResultsAndUpdateRefId(
    currentEmailAddresses: Map<string, FindRecipientPersonaType>,
    resp: SubstrateSearchSuggestionsResponse,
    resultList: FindRecipientPersonaType[],
    updateRefIds?: boolean
) {
    let suggestionMap = {};

    for (const group of resp.Groups) {
        if (group.Type === 'People') {
            if (updateRefIds) {
                group.Suggestions.forEach(x => {
                    suggestionMap[
                        (x?.EmailAddresses?.length > 0 ? x.EmailAddresses[0] : x?.PersonaId) ?? ''
                    ] = x.ReferenceId ?? '';
                });
            }

            let filteredSuggestions = group.Suggestions.filter(value => {
                return (
                    currentEmailAddresses[value.EmailAddresses ? value.EmailAddresses[0] : ''] ==
                    null
                );
            });
            group.Suggestions = filteredSuggestions;
            break;
        }
    }

    if (updateRefIds) {
        updateCacheRefIdsWith3SResponses(resultList, suggestionMap);
    }
}

function removeDuplicateFindPeopleResults(
    currentEmailAddresses: Map<string, FindRecipientPersonaType>,
    resp: FindPeopleResponseMessage
) {
    let filteredSuggestions = resp.ResultSet.filter(value => {
        return (
            currentEmailAddresses[value.EmailAddress ? value.EmailAddress.EmailAddress : ''] == null
        );
    });
    resp.ResultSet = filteredSuggestions;
}

/**
 * Updates the following information in the cache result list
 * - reference id with the server reference id
 * - transaction id with the conversation id
 */
function updateCacheRefIdsWith3SResponses(
    resultList: FindRecipientPersonaType[],
    suggestionMap: {}
): void {
    for (let findRecipient of resultList) {
        let serverRefId =
            suggestionMap[findRecipient.EmailAddress?.EmailAddress || findRecipient.PersonaId?.Id];

        if (serverRefId) {
            findRecipient.ReferenceId = serverRefId;
        }
    }
}
