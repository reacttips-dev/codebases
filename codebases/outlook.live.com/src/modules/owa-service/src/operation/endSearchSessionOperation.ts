import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type EndSearchSessionJsonRequest from '../contract/EndSearchSessionJsonRequest';
import type EndSearchSessionJsonResponse from '../contract/EndSearchSessionJsonResponse';
import endSearchSessionJsonRequest from '../factory/endSearchSessionJsonRequest';

export default function endSearchSessionOperation(
    req: EndSearchSessionJsonRequest,
    options?: RequestOptions
): Promise<EndSearchSessionJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = endSearchSessionJsonRequest(req);
    }

    return makeServiceRequest<EndSearchSessionJsonResponse>('EndSearchSession', req, options);
}
