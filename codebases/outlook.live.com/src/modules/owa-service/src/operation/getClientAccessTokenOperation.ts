import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetClientAccessTokenJsonRequest from '../contract/GetClientAccessTokenJsonRequest';
import type GetClientAccessTokenJsonResponse from '../contract/GetClientAccessTokenJsonResponse';
import getClientAccessTokenJsonRequest from '../factory/getClientAccessTokenJsonRequest';

export default function getClientAccessTokenOperation(
    req: GetClientAccessTokenJsonRequest,
    options?: RequestOptions
): Promise<GetClientAccessTokenJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getClientAccessTokenJsonRequest(req);
    }

    return makeServiceRequest<GetClientAccessTokenJsonResponse>(
        'GetClientAccessToken',
        req,
        options
    );
}
