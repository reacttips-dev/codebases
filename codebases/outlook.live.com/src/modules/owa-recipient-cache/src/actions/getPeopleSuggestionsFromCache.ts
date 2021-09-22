import { default as searchCache, searchSuggestionTrie } from '../selectors/searchCache';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import { isTrieCacheEnabled } from 'owa-substrate-people-suggestions/lib/utils/isTrieCacheEnabled';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import { lazyIsSuggestionTrieEmpty } from 'owa-3s-local';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import datapoints from '../datapoints';
import { DatapointStatus, PerformanceDatapoint, logUsage } from 'owa-analytics';

export async function getPeopleSuggestionsFromCache(
    queryString: string,
    recipientsToExclude: { EmailAddress: EmailAddressWrapper }[]
): Promise<FindRecipientPersonaType[]> {
    let rcTopFive: PersonaType[];

    if (isTrieCacheEnabled() && !(await lazyIsSuggestionTrieEmpty.importAndExecute())) {
        try {
            rcTopFive = await searchSuggestionTrie(
                queryString,
                5 /* numberOfResults */,
                recipientsToExclude
            );
        } catch (error) {
            let datapoint: PerformanceDatapoint = new PerformanceDatapoint(
                datapoints.SearchSuggestionTrie.name
            );
            datapoint.endWithError(
                DatapointStatus.ClientError,
                new Error('Could not search suggestion Trie: ' + error.Name)
            );
            return [];
        }
    } else {
        rcTopFive = searchCache(queryString, 5, recipientsToExclude);
    }

    logUsage('peopleCache_NumberOfContacts', [rcTopFive?.length ?? 0]);

    if (rcTopFive.length == 0) {
        return [];
    }

    let personaTypeSet = rcTopFive.map(result => {
        let findRecipientPersonaType = result as FindRecipientPersonaType;
        return {
            EmailAddress: result.EmailAddress,
            PersonaId: result.PersonaId,
            ADObjectId: result.ADObjectId,
            PersonaTypeString: result.PersonaTypeString,
            FeatureData: result.FeatureData,
            Id: findRecipientPersonaType.Id,
            PersonId: findRecipientPersonaType.PersonId,
        } as FindRecipientPersonaType;
    });

    return Promise.resolve(personaTypeSet);
}
