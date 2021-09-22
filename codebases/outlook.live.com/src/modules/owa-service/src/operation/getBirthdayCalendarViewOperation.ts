import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetBirthdayCalendarViewJsonRequest from '../contract/GetBirthdayCalendarViewJsonRequest';
import type GetBirthdayCalendarViewJsonResponse from '../contract/GetBirthdayCalendarViewJsonResponse';
import getBirthdayCalendarViewJsonRequest from '../factory/getBirthdayCalendarViewJsonRequest';

export default function getBirthdayCalendarViewOperation(
    req: GetBirthdayCalendarViewJsonRequest,
    options?: RequestOptions
): Promise<GetBirthdayCalendarViewJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getBirthdayCalendarViewJsonRequest(req);
    }

    return makeServiceRequest<GetBirthdayCalendarViewJsonResponse>(
        'GetBirthdayCalendarView',
        req,
        options
    );
}
