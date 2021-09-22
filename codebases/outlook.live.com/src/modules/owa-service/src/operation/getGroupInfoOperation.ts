import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetGroupInfoRequest from '../contract/GetGroupInfoRequest';
import type GetGroupResponse from '../contract/GetGroupResponse';
import getGroupInfoRequest from '../factory/getGroupInfoRequest';

export default function getGroupInfoOperation(
    req: { getGroupInfoRequest: GetGroupInfoRequest },
    options?: RequestOptions
): Promise<GetGroupResponse> {
    if (req.getGroupInfoRequest !== undefined && !req.getGroupInfoRequest['__type']) {
        req.getGroupInfoRequest = getGroupInfoRequest(req.getGroupInfoRequest);
    }

    return makeServiceRequest<GetGroupResponse>('GetGroupInfo', req, options);
}
