import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type FindUnifiedGroupsJsonRequest from '../contract/FindUnifiedGroupsJsonRequest';
import type FindUnifiedGroupsJsonResponse from '../contract/FindUnifiedGroupsJsonResponse';
import findUnifiedGroupsJsonRequest from '../factory/findUnifiedGroupsJsonRequest';

export default function findUnifiedGroupsOperation(
    req: FindUnifiedGroupsJsonRequest,
    options?: RequestOptions
): Promise<FindUnifiedGroupsJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = findUnifiedGroupsJsonRequest(req);
    }

    return makeServiceRequest<FindUnifiedGroupsJsonResponse>('FindUnifiedGroups', req, options);
}
