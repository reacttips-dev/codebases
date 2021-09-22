import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetUserUnifiedGroupsJsonRequest from '../contract/GetUserUnifiedGroupsJsonRequest';
import type GetUserUnifiedGroupsJsonResponse from '../contract/GetUserUnifiedGroupsJsonResponse';
import getUserUnifiedGroupsJsonRequest from '../factory/getUserUnifiedGroupsJsonRequest';

export default function getUserUnifiedGroupsOperation(
    req: GetUserUnifiedGroupsJsonRequest,
    options?: RequestOptions
): Promise<GetUserUnifiedGroupsJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getUserUnifiedGroupsJsonRequest(req);
    }

    return makeServiceRequest<GetUserUnifiedGroupsJsonResponse>(
        'GetUserUnifiedGroups',
        req,
        options
    );
}
