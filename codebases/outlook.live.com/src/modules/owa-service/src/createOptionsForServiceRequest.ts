import createFetchOptions from './createFetchOptions';
import { getConfig } from './config';
import type RequestOptions from './RequestOptions';
import getGuid from './getGuid';
import { correlationVectorHeaderName, getCorrelationVector } from './correlationVector';
import { getSessionId } from 'owa-config';

const MAX_HTTP_HEADER_LENGTH = 2048;

export default async function createOptionsForServiceRequest(
    options: RequestOptions | undefined,
    parameters?: any,
    actionName?: string
) {
    let config = getConfig();
    if (config.prepareRequestOptions) {
        const requestOptions = config.prepareRequestOptions(options);
        if (requestOptions) {
            if ((<Promise<RequestOptions>>requestOptions).then) {
                options = await (<Promise<RequestOptions>>requestOptions);
            } else {
                options = <RequestOptions>requestOptions;
            }
        }
    }

    const fetchOptions = await createFetchOptions(options);
    const headers = fetchOptions.headers;

    if (actionName) {
        headers.set('Action', actionName);
    }

    // Add CorrelationId in header, so the FrontEnd-Begin and FrontEnd-End could be stamped in FE server.
    headers.set('X-OWA-CorrelationId', getGuid());
    headers.set('X-OWA-SessionId', getSessionId());

    if (parameters) {
        headers.append('Content-Type', 'application/json; charset=utf-8');

        let serializedRequestBody = JSON.stringify(parameters);
        let urlEncodedSerializedRequestBody = encodeURIComponent(serializedRequestBody);

        // Check whether to send the payload on the body or on the header
        if (
            fetchOptions.noEmptyPost ||
            urlEncodedSerializedRequestBody.length > MAX_HTTP_HEADER_LENGTH
        ) {
            fetchOptions.body = serializedRequestBody;
        } else {
            // Add empty post marker for logs.
            // endpoint += '&EP=1';

            headers.append('X-OWA-UrlPostData', urlEncodedSerializedRequestBody);
            fetchOptions.body = undefined;
        }
    }

    if (!headers.has(correlationVectorHeaderName)) {
        let cv = getCorrelationVector();
        // the cv can be falsy if it gets corrupted, in that case there is no point in sending it
        if (cv) {
            headers.append(correlationVectorHeaderName, cv);
        }
    }

    return fetchOptions;
}
