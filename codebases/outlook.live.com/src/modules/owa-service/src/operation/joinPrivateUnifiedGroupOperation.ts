import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type JoinPrivateUnifiedGroupJsonRequest from '../contract/JoinPrivateUnifiedGroupJsonRequest';
import type JoinPrivateUnifiedGroupJsonResponse from '../contract/JoinPrivateUnifiedGroupJsonResponse';
import joinPrivateUnifiedGroupJsonRequest from '../factory/joinPrivateUnifiedGroupJsonRequest';

export default function joinPrivateUnifiedGroupOperation(
    req: JoinPrivateUnifiedGroupJsonRequest,
    options?: RequestOptions
): Promise<JoinPrivateUnifiedGroupJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = joinPrivateUnifiedGroupJsonRequest(req);
    }

    return makeServiceRequest<JoinPrivateUnifiedGroupJsonResponse>(
        'JoinPrivateUnifiedGroup',
        req,
        options
    );
}
