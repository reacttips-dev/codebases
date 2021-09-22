import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type TokenRequest from '../contract/TokenRequest';
import type TokenResponse from '../contract/TokenResponse';
import tokenRequest from '../factory/tokenRequest';

export default function getAccessTokenforResourceOperation(
    req: TokenRequest,
    options?: RequestOptions
): Promise<TokenResponse> {
    if (req !== undefined && !req['__type']) {
        req = tokenRequest(req);
    }

    return makeServiceRequest<TokenResponse>('GetAccessTokenforResource', req, options);
}
