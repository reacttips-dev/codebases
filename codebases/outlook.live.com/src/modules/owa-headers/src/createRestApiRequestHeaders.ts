import { isConnectedAccount } from 'owa-accounts-store';
import { getConnectedAccountHeaders } from 'owa-connected-account-headers';
import { createRestApiRequestHeadersWithFetchOptions } from './createRestApiRequestHeadersWithFetchOptions';

export function createRestApiRequestHeaders(userIdentity: string = null): Promise<void | {}> {
    if (isConnectedAccount(userIdentity)) {
        return createRestApiRequestHeadersWithFetchOptions().then(headers => {
            const authHeaders = getConnectedAccountHeaders(userIdentity);

            // Merge the connected account headers with the rest api request headers
            return authHeaders.then(authHeaders => {
                Object.keys(authHeaders).forEach(
                    headerName => (headers[headerName] = authHeaders[headerName])
                );

                return headers;
            });
        });
    }
    return Promise.resolve({});
}
