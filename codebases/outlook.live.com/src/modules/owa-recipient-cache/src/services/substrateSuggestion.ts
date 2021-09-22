import { getGuid } from 'owa-guid';
import { makePostRequest } from 'owa-ows-gateway';
import type { SubstrateSearchSuggestionsResponse } from 'owa-search-service';
import {
    getSubstrateSuggestionFields,
    SubstrateScenario,
} from 'owa-substrate-people-suggestions/lib/utils/substrateSuggestionUtils';
import { getParams } from 'owa-substrate-people-suggestions/lib/services/substrateSuggestions';
import { getCacheContactsCount } from '../selectors/getCacheContactsCount';

const SUGGESTIONS_POST_ENDPOINT = '/search/api/v1/suggestions?';
const SCENARIO_NAME = 'owa.react.recipientcache';

export default async function substrateSuggestions(
    cvid?: string
): Promise<SubstrateSearchSuggestionsResponse> {
    let entityRequest = await createEntityRequest();
    let suggestionJsonRequest = createSuggestionsJsonRequest(entityRequest, cvid);

    return makePostRequest(
        SUGGESTIONS_POST_ENDPOINT + getParams(SCENARIO_NAME),
        suggestionJsonRequest,
        null /*correlationId*/,
        false /*returnFullResponse*/,
        null /*customHeaders*/,
        true /*throwServiceError*/,
        undefined /* sendPayLoadAsBody */,
        /* 3S does not need auth cookies so omitting them will decrease request header size */
        false /* includeCredentials */
    ).then(
        resp => {
            return resp;
        },
        rejected => {
            throw new Error(rejected.message);
        }
    );
}

async function createEntityRequest(): Promise<any> {
    let entityRequest = {
        Query: {
            QueryString: '',
        },
        EntityType: 'People',
        Provenances: ['Mailbox'],
        Size: getCacheContactsCount(),
        Fields: getSubstrateSuggestionFields(SubstrateScenario.TopN),
    };

    return entityRequest;
}

function createSuggestionsJsonRequest(entityRequest: any, cvid?: string): any {
    return {
        AppName: 'OWA',
        Scenario: {
            Name: SCENARIO_NAME,
        },
        Cvid: cvid ?? getGuid(),
        EntityRequests: [entityRequest],
    };
}
