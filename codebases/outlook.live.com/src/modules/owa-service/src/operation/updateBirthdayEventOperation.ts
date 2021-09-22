import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type UpdateBirthdayEventJsonRequest from '../contract/UpdateBirthdayEventJsonRequest';
import type UpdateBirthdayEventJsonResponse from '../contract/UpdateBirthdayEventJsonResponse';
import updateBirthdayEventJsonRequest from '../factory/updateBirthdayEventJsonRequest';

export default function updateBirthdayEventOperation(
    req: UpdateBirthdayEventJsonRequest,
    options?: RequestOptions
): Promise<UpdateBirthdayEventJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = updateBirthdayEventJsonRequest(req);
    }

    return makeServiceRequest<UpdateBirthdayEventJsonResponse>('UpdateBirthdayEvent', req, options);
}
