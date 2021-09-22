import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetUnifiedGroupMembersJsonRequest from '../contract/GetUnifiedGroupMembersJsonRequest';
import type GetUnifiedGroupMembersJsonResponse from '../contract/GetUnifiedGroupMembersJsonResponse';
import getUnifiedGroupMembersJsonRequest from '../factory/getUnifiedGroupMembersJsonRequest';

export default function getUnifiedGroupMembersOperation(
    req: GetUnifiedGroupMembersJsonRequest,
    options?: RequestOptions
): Promise<GetUnifiedGroupMembersJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getUnifiedGroupMembersJsonRequest(req);
    }

    return makeServiceRequest<GetUnifiedGroupMembersJsonResponse>(
        'GetUnifiedGroupMembers',
        req,
        options
    );
}
