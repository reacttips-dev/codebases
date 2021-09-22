import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type SetUnifiedGroupUserSubscribeStateJsonRequest from '../contract/SetUnifiedGroupUserSubscribeStateJsonRequest';
import type SetUnifiedGroupUserSubscribeStateJsonResponse from '../contract/SetUnifiedGroupUserSubscribeStateJsonResponse';
import setUnifiedGroupUserSubscribeStateJsonRequest from '../factory/setUnifiedGroupUserSubscribeStateJsonRequest';

export default function setUnifiedGroupUserSubscribeStateOperation(
    req: SetUnifiedGroupUserSubscribeStateJsonRequest,
    options?: RequestOptions
): Promise<SetUnifiedGroupUserSubscribeStateJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = setUnifiedGroupUserSubscribeStateJsonRequest(req);
    }

    return makeServiceRequest<SetUnifiedGroupUserSubscribeStateJsonResponse>(
        'SetUnifiedGroupUserSubscribeState',
        req,
        options
    );
}
