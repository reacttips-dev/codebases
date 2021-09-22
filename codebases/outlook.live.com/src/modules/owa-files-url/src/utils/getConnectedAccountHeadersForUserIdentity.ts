import type RequestOptions from 'owa-service/lib/RequestOptions';
import { getConnectedAccountHeaders } from 'owa-connected-account-headers';
import { setHeaders } from 'owa-headers-core';

/**
 * Get connected account headers
 */
export async function getConnectedAccountHeadersForUserIdentity(
    userIdentity: string
): Promise<RequestOptions> {
    let requestOptions: RequestOptions = {};
    requestOptions.headers = new Headers();
    const connectedAccountHeaders = await getConnectedAccountHeaders(userIdentity);
    setHeaders(requestOptions.headers, connectedAccountHeaders);

    return requestOptions;
}
