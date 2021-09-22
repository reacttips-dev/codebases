import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type SetUnifiedGroupMembershipStateJsonRequest from '../contract/SetUnifiedGroupMembershipStateJsonRequest';
import type SetUnifiedGroupMembershipStateJsonResponse from '../contract/SetUnifiedGroupMembershipStateJsonResponse';
import setUnifiedGroupMembershipStateJsonRequest from '../factory/setUnifiedGroupMembershipStateJsonRequest';

export default function setUnifiedGroupMembershipStateOperation(
    req: SetUnifiedGroupMembershipStateJsonRequest,
    options?: RequestOptions
): Promise<SetUnifiedGroupMembershipStateJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = setUnifiedGroupMembershipStateJsonRequest(req);
    }

    return makeServiceRequest<SetUnifiedGroupMembershipStateJsonResponse>(
        'SetUnifiedGroupMembershipState',
        req,
        options
    );
}
