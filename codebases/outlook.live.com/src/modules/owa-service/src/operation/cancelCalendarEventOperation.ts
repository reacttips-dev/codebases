import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type CancelCalendarEventJsonRequest from '../contract/CancelCalendarEventJsonRequest';
import type CancelCalendarEventJsonResponse from '../contract/CancelCalendarEventJsonResponse';
import cancelCalendarEventJsonRequest from '../factory/cancelCalendarEventJsonRequest';

export default function cancelCalendarEventOperation(
    req: CancelCalendarEventJsonRequest,
    options?: RequestOptions
): Promise<CancelCalendarEventJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = cancelCalendarEventJsonRequest(req);
    }

    return makeServiceRequest<CancelCalendarEventJsonResponse>('CancelCalendarEvent', req, options);
}
