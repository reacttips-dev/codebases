import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import type { SubstrateSearchSuggestionsResponse } from 'owa-search-service';
import convertSuggestionToPersonaType from 'owa-recipient-suggestions/lib/util/convertSuggestionToPersonaType';
import type { TraceErrorObject } from 'owa-trace';

const DEFAULT_MAX_RESULTS = 20;

export default function processSubstrateSuggestionsResponse(
    resultList: FindRecipientPersonaType[],
    resp: SubstrateSearchSuggestionsResponse,
    correlationId: string | null,
    appendResults: boolean,
    maxResults?: number,
    returnMaskedRecipients?: boolean
) {
    if (!resp || !resp.Groups) {
        const error: TraceErrorObject = new Error('Response groups should not be null');
        error.networkError = true;
        throw error;
    } else {
        let personaTypeSet: FindRecipientPersonaType[] = [];

        maxResults = maxResults ? maxResults : DEFAULT_MAX_RESULTS;
        maxResults = appendResults ? maxResults - resultList.length : maxResults;
        const transactionId = resp.Instrumentation?.TraceId;
        for (const group of resp.Groups) {
            if (group.Type === 'People') {
                group.Suggestions.forEach(suggestion => {
                    if (personaTypeSet.length < maxResults) {
                        const personaType = convertSuggestionToPersonaType(
                            suggestion,
                            transactionId,
                            returnMaskedRecipients,
                            correlationId
                        );
                        personaType && personaTypeSet.push(personaType);
                    }
                });
                break;
            }
        }

        if (appendResults) {
            resultList.push(...personaTypeSet);
        } else {
            resultList.splice(0, resultList.length, ...personaTypeSet);
        }
    }
}
