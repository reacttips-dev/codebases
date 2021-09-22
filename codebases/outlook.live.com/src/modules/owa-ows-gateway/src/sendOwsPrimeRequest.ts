import { makeRequest } from './makeServiceRequest';
import type { OwsRequestOptions } from './OwsRequestOptions';
import type { HttpMethod } from './constants';

/**
 * Sends a request to OWS Prime.
 * Unlike makeRequest, actionName is mandatory and becomes the first parameter,
 * ensuring we can distinguish this call in telemetry events.
 * The requestMethod parameter also comes before the URL, mimicking the order in HTTP.
 */
export default function sendOwsPrimeRequest<TResponse>(
    actionName: string,
    requestMethod: HttpMethod,
    requestUrl: string,
    options: OwsRequestOptions
): Promise<TResponse | Response> {
    return makeRequest(requestUrl, requestMethod, options, actionName);
}
