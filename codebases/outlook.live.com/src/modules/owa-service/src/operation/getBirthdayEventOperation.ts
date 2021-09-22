import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetBirthdayEventJsonRequest from '../contract/GetBirthdayEventJsonRequest';
import type GetBirthdayEventJsonResponse from '../contract/GetBirthdayEventJsonResponse';
import getBirthdayEventJsonRequest from '../factory/getBirthdayEventJsonRequest';

export default function getBirthdayEventOperation(
    req: GetBirthdayEventJsonRequest,
    options?: RequestOptions
): Promise<GetBirthdayEventJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getBirthdayEventJsonRequest(req);
    }

    return makeServiceRequest<GetBirthdayEventJsonResponse>('GetBirthdayEvent', req, options);
}
