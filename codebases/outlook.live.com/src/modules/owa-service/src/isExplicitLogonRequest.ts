import type { RequestOptions } from './RequestOptions';

/**
 * Returns true if the request is explicit logon request, false otherwise.
 */
export default function isExplicitLogonRequest(requestOptions: RequestOptions | undefined) {
    return requestOptions?.headers && requestOptions.headers.get('X-OWA-ExplicitLogonUser') != null;
}
