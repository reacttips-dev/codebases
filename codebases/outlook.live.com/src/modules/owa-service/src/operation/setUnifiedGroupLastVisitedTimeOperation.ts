import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type SetUnifiedGroupLastVisitedTimeJsonRequest from '../contract/SetUnifiedGroupLastVisitedTimeJsonRequest';
import type SetUnifiedGroupLastVisitedTimeJsonResponse from '../contract/SetUnifiedGroupLastVisitedTimeJsonResponse';
import setUnifiedGroupLastVisitedTimeJsonRequest from '../factory/setUnifiedGroupLastVisitedTimeJsonRequest';

export default function setUnifiedGroupLastVisitedTimeOperation(
    req: SetUnifiedGroupLastVisitedTimeJsonRequest,
    options?: RequestOptions
): Promise<SetUnifiedGroupLastVisitedTimeJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = setUnifiedGroupLastVisitedTimeJsonRequest(req);
    }

    return makeServiceRequest<SetUnifiedGroupLastVisitedTimeJsonResponse>(
        'SetUnifiedGroupLastVisitedTime',
        req,
        options
    );
}
