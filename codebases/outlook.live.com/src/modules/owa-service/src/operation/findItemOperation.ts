import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type FindItemJsonRequest from '../contract/FindItemJsonRequest';
import type FindItemJsonResponse from '../contract/FindItemJsonResponse';
import findItemJsonRequest from '../factory/findItemJsonRequest';

export default function findItemOperation(
    req: FindItemJsonRequest,
    options?: RequestOptions
): Promise<FindItemJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = findItemJsonRequest(req);
    }

    return makeServiceRequest<FindItemJsonResponse>('FindItem', req, options);
}
