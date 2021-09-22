import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetUserAvailabilityInternalJsonRequest from '../contract/GetUserAvailabilityInternalJsonRequest';
import type GetUserAvailabilityInternalJsonResponse from '../contract/GetUserAvailabilityInternalJsonResponse';
import getUserAvailabilityInternalJsonRequest from '../factory/getUserAvailabilityInternalJsonRequest';

export default function getUserAvailabilityInternalOperation(
    req: { request: GetUserAvailabilityInternalJsonRequest },
    options?: RequestOptions
): Promise<GetUserAvailabilityInternalJsonResponse> {
    if (req.request !== undefined && !req.request['__type']) {
        req.request = getUserAvailabilityInternalJsonRequest(req.request);
    }

    return makeServiceRequest<GetUserAvailabilityInternalJsonResponse>(
        'GetUserAvailabilityInternal',
        req,
        options
    );
}
