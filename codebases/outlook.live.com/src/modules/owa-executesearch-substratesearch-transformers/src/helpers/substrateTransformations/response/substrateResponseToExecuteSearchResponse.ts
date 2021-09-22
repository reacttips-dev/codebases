import substrateResponseBodyToExecuteSearchResponseBody from './substrateResponseBodyToExecuteSearchResponseBody';
import type SubstrateSearchRequest from 'owa-search-service/lib/data/schema/SubstrateSearchRequest';
import type SubstrateSearchResponse from 'owa-search-service/lib/data/schema/SubstrateSearchResponse';
import type ExecuteSearchJsonResponse from 'owa-service/lib/contract/ExecuteSearchJsonResponse';
import type ExecuteSearchResponseMessage from 'owa-service/lib/contract/ExecuteSearchResponseMessage';

export default async function substrateResponseToExecuteSearchResponse(
    response: Response,
    substrateSearchResponseBody: SubstrateSearchResponse,
    substrateSearchRequest: SubstrateSearchRequest,
    substrateApiVersion: number
): Promise<ExecuteSearchJsonResponse> {
    /**
     * - If there's no response, return the ExecuteSearch equivalent of a 504.
     * - If there's a non-200 response, return a response with error message.
     * - If there's a 200 response, convert 3S response to ExecuteSearch response
     *   and return.
     */
    if (response) {
        if (response.status !== 200) {
            // Return a response object with the error from the server.
            return {
                Body: {
                    MessageText: getError(response, substrateSearchResponseBody),
                },
            };
        } else {
            // Transforms 3S response to ExecuteSearch response.
            const executeSearchResponse: ExecuteSearchResponseMessage = substrateResponseBodyToExecuteSearchResponseBody(
                substrateSearchResponseBody,
                substrateSearchRequest,
                substrateApiVersion
            );

            // Return a successful response object containing the search results.
            return {
                Body: {
                    ...executeSearchResponse,
                },
            };
        }
    }

    // If no response was received, return this message (equivalent to a 504).
    return {
        Body: {
            MessageText: 'No response received',
        },
    };
}

const getError = (
    response: Response,
    substrateSearchResponseBody: SubstrateSearchResponse
): string => {
    if (substrateSearchResponseBody?.error) {
        return JSON.stringify(substrateSearchResponseBody.error);
    }

    return response.statusText;
};
