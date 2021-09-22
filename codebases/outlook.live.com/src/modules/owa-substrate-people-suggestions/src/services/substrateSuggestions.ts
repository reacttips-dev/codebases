import type { default as EntityRequest, Provenance } from '../store/schema/EntityRequest';
import type ExecuteSuggestionsRequest from '../store/schema/ExecuteSuggestionsRequest';
import { isConnectedAccount } from 'owa-accounts-store';
import { getConnectedAccountHeaders } from 'owa-connected-account-headers';
import { isFeatureEnabled } from 'owa-feature-flags';
import type { FeedbackManagerState } from 'owa-feedback-manager/lib/store/schema/FeedbackManagerState';
import { getGuid } from 'owa-guid';
import { isSuccessStatusCode } from 'owa-http-status-codes';
import { makeGetRequest, makePostRequest } from 'owa-ows-gateway';
import type { SubstrateSearchSuggestionsResponse } from 'owa-search-service';
import buildQueryParams from 'owa-search-service/lib/helpers/buildQueryParams';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { isTrieCacheEnabled } from '../utils/isTrieCacheEnabled';
import * as trace from 'owa-trace';
import { getSubstrateSuggestionFields, SubstrateScenario } from '../utils/substrateSuggestionUtils';

const INIT_GET_ENDPOINT = '/search/api/v1/init?';
const SUGGESTIONS_POST_ENDPOINT = '/search/api/v1/suggestions?';
const SCENARIO_NAME = 'owa.react.compose';
const MAX_ENTRIES_DIRECTORY = '20';
const MAX_ENTRIES_TYPEDOWN = '5';
const CSR_CLIENT_ENABLED = 'CSRClientEnabled';
export const PEOPLE_CARD_SCENARIO_NAME = 'owa.projectMoca.peopleCard';

export default async function substrateSuggestions(
    userIdentity: string | null,
    queryString: string,
    includeDirectory: boolean,
    correlationId?: string | null,
    feedbackManager?: FeedbackManagerState | null,
    currentRecipients?: string[] | null,
    scenario?: string | null,
    isCachePopulated: boolean | null = true
): Promise<SubstrateSearchSuggestionsResponse> {
    const scenarioName = scenario || SCENARIO_NAME;

    if (queryString == null) {
        return makeInitRequest(scenarioName);
    } else {
        let entityRequest = await createEntityRequest(
            queryString,
            includeDirectory,
            isCachePopulated,
            currentRecipients,
            scenarioName
        );
        let suggestionJsonRequest = createSuggestionsJsonRequest(
            entityRequest,
            feedbackManager?.conversationId,
            scenarioName
        );

        return makePostRequest(
            SUGGESTIONS_POST_ENDPOINT + getParams(scenarioName, queryString),
            suggestionJsonRequest,
            correlationId /*correlationId*/,
            false /*returnFullResponse*/,
            await getCustomHeaders(userIdentity, feedbackManager?.clientSessionId),
            true /* throwServiceError */,
            true /* sendPayloadAsBody */,
            /* 3S does not need auth cookies so omitting them will decrease request header size */
            false /* includecredentials */
        )
            .then(resp => {
                return resp;
            })
            .catch(err => {
                trace.trace.info(err);
                return null;
            });
    }
}

async function makeInitRequest(scenario: string) {
    return makeGetRequest(
        INIT_GET_ENDPOINT + getParams(scenario),
        undefined /*correlationId*/,
        true /*returnFullResponse*/,
        await getCustomHeaders(null),
        true /* throwServiceError */,
        /* 3S does not need auth cookies so omitting them will decrease request header size */
        false /* IncludeCredentials */
    )
        .then(resp => {
            if (isSuccessStatusCode(resp.status)) {
                return resp.json() as Promise<SubstrateSearchSuggestionsResponse>;
            } else {
                return null;
            }
        })
        .catch(err => {
            err.networkError = true;
            trace.errorThatWillCauseAlert(err);
            return null;
        });
}

async function createEntityRequest(
    queryString: string,
    includeDirectory: boolean,
    isCachePopulated: boolean,
    currentRecipients?: string[],
    scenarioName?: string
): Promise<EntityRequest> {
    let entityRequest: EntityRequest = {
        Query: {
            QueryString: queryString,
        },
        EntityType: 'People',
        Provenances: getProvenances(includeDirectory),
        Size: includeDirectory ? MAX_ENTRIES_DIRECTORY : MAX_ENTRIES_TYPEDOWN,
    };

    if (currentRecipients && currentRecipients.length > 0) {
        entityRequest.Context = createEntityRequestContext(currentRecipients);
    }

    scenarioName === PEOPLE_CARD_SCENARIO_NAME
        ? (entityRequest.Fields = getSubstrateSuggestionFields(
              SubstrateScenario.PeopleCard,
              isCachePopulated
          ))
        : (entityRequest.Fields = getSubstrateSuggestionFields(
              SubstrateScenario.Search,
              isCachePopulated
          ));

    return entityRequest;
}

function createSuggestionsJsonRequest(
    entityRequest: EntityRequest,
    cvid: string,
    scenario: string
): ExecuteSuggestionsRequest {
    return {
        AppName: 'OWA',
        Scenario: {
            Name: scenario,
        },
        Cvid: cvid ? cvid : getGuid(),
        EntityRequests: [entityRequest],
    };
}

function createEntityRequestContext(currentRecipients: string[]): { [index: string]: string } {
    let context: { [index: string]: string } = {};

    if (currentRecipients) {
        context.RecipientsTo = currentRecipients.toString();
    }

    return context;
}

function getProvenances(includeDirectory: boolean): Provenance[] {
    let provenances: Provenance[] = ['Mailbox'];

    if (includeDirectory && !isConsumer()) {
        provenances.push('Directory');
    }

    return provenances;
}

export function getParams(scenario: string, queryString?: string): string {
    const params = {
        scenario: scenario,
        ...buildQueryParams(),
    };

    let flights = [];
    if (isTrieCacheEnabled()) {
        flights.push(CSR_CLIENT_ENABLED);
    }
    if (isFeatureEnabled('rp-cacheFirstPeopleTrieSize500cf')) {
        flights.push(CSR_CLIENT_ENABLED);
    }
    if (params['setflight']) {
        flights.push(params['setflight']);
    }

    if (flights.length > 0) {
        params['setflight'] = flights.join(',');
    }

    return Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');
}

async function getCustomHeaders(userIdentity: string, sessionId?: string): Promise<any> {
    let headers: { [header: string]: any } = {};
    if (sessionId) {
        headers['client-session-id'] = sessionId;
    }

    if (userIdentity && isConnectedAccount(userIdentity)) {
        // Merge the connected account headers
        return getConnectedAccountHeaders(userIdentity).then(connectedAccountHeaders => {
            Object.keys(connectedAccountHeaders).forEach(
                headerName => (headers[headerName] = connectedAccountHeaders[headerName])
            );

            return headers;
        });
    }

    return headers;
}
