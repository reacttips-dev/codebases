import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type RespondToCalendarEventJsonRequest from '../contract/RespondToCalendarEventJsonRequest';
import type RespondToCalendarEventJsonResponse from '../contract/RespondToCalendarEventJsonResponse';
import respondToCalendarEventJsonRequest from '../factory/respondToCalendarEventJsonRequest';

export default function respondToCalendarEventOperation(
    req: RespondToCalendarEventJsonRequest,
    options?: RequestOptions
): Promise<RespondToCalendarEventJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = respondToCalendarEventJsonRequest(req);
    }

    return makeServiceRequest<RespondToCalendarEventJsonResponse>(
        'RespondToCalendarEvent',
        req,
        options
    );
}
