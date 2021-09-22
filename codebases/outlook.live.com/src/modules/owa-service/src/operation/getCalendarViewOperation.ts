import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetCalendarViewJsonRequest from '../contract/GetCalendarViewJsonRequest';
import type GetCalendarViewJsonResponse from '../contract/GetCalendarViewJsonResponse';
import getCalendarViewJsonRequest from '../factory/getCalendarViewJsonRequest';

export default function getCalendarViewOperation(
    req: GetCalendarViewJsonRequest,
    options?: RequestOptions
): Promise<GetCalendarViewJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getCalendarViewJsonRequest(req);
    }

    return makeServiceRequest<GetCalendarViewJsonResponse>('GetCalendarView', req, options);
}
