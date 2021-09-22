import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetUnifiedGroupDetailsJsonRequest from '../contract/GetUnifiedGroupDetailsJsonRequest';
import type GetUnifiedGroupDetailsJsonResponse from '../contract/GetUnifiedGroupDetailsJsonResponse';
import getUnifiedGroupDetailsJsonRequest from '../factory/getUnifiedGroupDetailsJsonRequest';

export default function getUnifiedGroupDetailsOperation(
    req: GetUnifiedGroupDetailsJsonRequest,
    options?: RequestOptions
): Promise<GetUnifiedGroupDetailsJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getUnifiedGroupDetailsJsonRequest(req);
    }

    return makeServiceRequest<GetUnifiedGroupDetailsJsonResponse>(
        'GetUnifiedGroupDetails',
        req,
        options
    );
}
