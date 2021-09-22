import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetAccessTokenForDataProviderRequest from '../contract/GetAccessTokenForDataProviderRequest';
import type TokenResponse from '../contract/TokenResponse';
import getAccessTokenForDataProviderRequest from '../factory/getAccessTokenForDataProviderRequest';

export default function getAccessTokenforDataProviderOperation(
    req: GetAccessTokenForDataProviderRequest,
    options?: RequestOptions
): Promise<TokenResponse> {
    if (req !== undefined && !req['__type']) {
        req = getAccessTokenForDataProviderRequest(req);
    }

    return makeServiceRequest<TokenResponse>('GetAccessTokenforDataProvider', req, options);
}
