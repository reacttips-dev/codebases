import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetCalendarEventJsonRequest from '../contract/GetCalendarEventJsonRequest';
import type GetCalendarEventJsonResponse from '../contract/GetCalendarEventJsonResponse';
import getCalendarEventJsonRequest from '../factory/getCalendarEventJsonRequest';

export default function getCalendarEventOperation(
    req: GetCalendarEventJsonRequest,
    options?: RequestOptions
): Promise<GetCalendarEventJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getCalendarEventJsonRequest(req);
    }

    return makeServiceRequest<GetCalendarEventJsonResponse>('GetCalendarEvent', req, options);
}
