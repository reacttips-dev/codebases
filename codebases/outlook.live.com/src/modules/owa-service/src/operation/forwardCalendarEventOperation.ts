import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type ForwardCalendarEventJsonRequest from '../contract/ForwardCalendarEventJsonRequest';
import type ForwardCalendarEventJsonResponse from '../contract/ForwardCalendarEventJsonResponse';
import forwardCalendarEventJsonRequest from '../factory/forwardCalendarEventJsonRequest';

export default function forwardCalendarEventOperation(
    req: ForwardCalendarEventJsonRequest,
    options?: RequestOptions
): Promise<ForwardCalendarEventJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = forwardCalendarEventJsonRequest(req);
    }

    return makeServiceRequest<ForwardCalendarEventJsonResponse>(
        'ForwardCalendarEvent',
        req,
        options
    );
}
