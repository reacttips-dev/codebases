import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type AuthenticationUrlRequest from '../contract/AuthenticationUrlRequest';
import type AuthenticationUrlResponse from '../contract/AuthenticationUrlResponse';
import authenticationUrlRequest from '../factory/authenticationUrlRequest';

export default function getAuthenticationUrlOperation(
    req: AuthenticationUrlRequest,
    options?: RequestOptions
): Promise<AuthenticationUrlResponse> {
    if (req !== undefined && !req['__type']) {
        req = authenticationUrlRequest(req);
    }

    return makeServiceRequest<AuthenticationUrlResponse>('GetAuthenticationUrl', req, options);
}
