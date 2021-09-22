import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetSearchSuggestionsJsonRequest from '../contract/GetSearchSuggestionsJsonRequest';
import type GetSearchSuggestionsJsonResponse from '../contract/GetSearchSuggestionsJsonResponse';
import getSearchSuggestionsJsonRequest from '../factory/getSearchSuggestionsJsonRequest';

export default function getSearchSuggestionsOperation(
    req: GetSearchSuggestionsJsonRequest,
    options?: RequestOptions
): Promise<GetSearchSuggestionsJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getSearchSuggestionsJsonRequest(req);
    }

    return makeServiceRequest<GetSearchSuggestionsJsonResponse>(
        'GetSearchSuggestions',
        req,
        options
    );
}
